from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import text
from db import SessionLocal
from typing import Optional
from datetime import datetime
from models import (
    VulnerabilityCreate, VulnerabilityUpdate, VulnerabilityResponse,
    VulnerabilitySummaryResponse, PaginatedResponse, ApiResponse
)

router = APIRouter(prefix="/api", tags=["vulnerabilities"])

# --- helpers ---------------------------------------------------------------
def _get_vuln_columns(db) -> set:
    cols = db.execute(text("""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'vulnerabilities'
    """)).scalars().all()
    return set(cols or [])

# --- Vulnerability Summary ---
@router.get("/vulnerabilities-summary", response_model=VulnerabilitySummaryResponse)
def get_vulnerabilities_summary():
    """Get vulnerability summary by severity and status."""
    with SessionLocal() as db:
        severity_summary = db.execute(text("""
            SELECT
                COUNT(*) FILTER (WHERE v.severity = 'Critical') AS critical,
                COUNT(*) FILTER (WHERE v.severity = 'High') AS high,
                COUNT(*) FILTER (WHERE v.severity = 'Medium') AS medium,
                COUNT(*) FILTER (WHERE v.severity = 'Low') AS low
            FROM asset_vulnerability av
            JOIN vulnerabilities v ON av.vuln_id = v.id;
        """)).mappings().first()

        severity_data = dict(severity_summary) if severity_summary else {
            "critical": 0, "high": 0, "medium": 0, "low": 0
        }

        status_summary = db.execute(text("""
            SELECT
                COUNT(*) FILTER (WHERE av.status = 'Open') AS open,
                COUNT(*) FILTER (WHERE av.status = 'In Progress') AS in_progress,
                COUNT(*) FILTER (WHERE av.status = 'Resolved') AS resolved,
                COUNT(*) FILTER (WHERE av.status = 'False Positive') AS false_positive,
                COUNT(*) FILTER (WHERE av.status = 'Muted') AS muted,
                COUNT(*) FILTER (WHERE av.status = 'Accepted Risk') AS accepted_risk,
                COUNT(*) FILTER (WHERE av.status = 'Fixed') AS fixed
            FROM asset_vulnerability av;
        """)).mappings().first()

        status_data = dict(status_summary) if status_summary else {
            "open": 0, "in_progress": 0, "resolved": 0, "false_positive": 0,
            "muted": 0, "accepted_risk": 0, "fixed": 0
        }

        return {
            "data": {
                "severity": {
                    "critical": {
                        "count": severity_data.get("critical", 0),
                        "description": "Immediate action required",
                        "priority": "High priority"
                    },
                    "high": {
                        "count": severity_data.get("high", 0),
                        "description": "Address within 24 hours",
                        "priority": "Priority"
                    },
                    "medium": {
                        "count": severity_data.get("medium", 0),
                        "description": "Address within 7 days",
                        "priority": "Moderate"
                    },
                    "low": {
                        "count": severity_data.get("low", 0),
                        "description": "Address within 30 days",
                        "priority": "Low priority"
                    }
                },
                "status": {
                    "open": status_data.get("open", 0),
                    "inProgress": status_data.get("in_progress", 0),
                    "resolved": status_data.get("resolved", 0),
                    "falsePositive": status_data.get("false_positive", 0),
                    "muted": status_data.get("muted", 0),
                    "acceptedRisk": status_data.get("accepted_risk", 0),
                    "fixed": status_data.get("fixed", 0)
                }
            }
        }

# --- Get All Vulnerabilities ---
@router.get("/vulnerabilities", response_model=PaginatedResponse)
def get_vulnerabilities(
    search: Optional[str] = Query(None, description="Search by plugin_name, cve, asset_name, or description"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    status: Optional[str] = Query(None, description="Filter by status"),
    asset_type: Optional[str] = Query(None, description="Filter by asset type"),
    environment: Optional[str] = Query(None, description="Filter by environment"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    with SessionLocal() as db:
        # Build the main query with JOIN through asset_vulnerability
        query = """
            SELECT 
                av.id as av_id,
                av.asset_id,
                av.vuln_id,
                av.status,
                av.first_seen,
                av.last_seen,
                av.evidence,
                av.plugin_output,
                av.code_snippet,
                av.context_repo,
                av.context_project,
                av.context_file_path,
                av.context_line,
                av.context_url,
                av.tool_vuln_id,
                v.vuln_identifier,
                v.name as vuln_name,
                v.cve,
                v.cwe,
                v.owasp,
                v.severity,
                v.cvss_v3_base,
                v.risk_factor,
                v.epss,
                v.description as vuln_description,
                v.remediation,
                v.reference,
                v.solution,
                v.source as vuln_source,
                a.asset_name,
                a.ip_address,
                a.fqdn,
                a.asset_type,
                a.environment,
                a.criticality,
                a.region_or_site,
                a.owner,
                a.tags
            FROM asset_vulnerability av
            JOIN vulnerabilities v ON av.vuln_id = v.id
            JOIN assets a ON av.asset_id = a.id
            WHERE 1=1
        """
        params = {}

        if search:
            search_clauses = [
                "v.name ILIKE :search", 
                "v.cve ILIKE :search", 
                "a.asset_name ILIKE :search",
                "v.description ILIKE :search",
                "v.vuln_identifier ILIKE :search",
                "av.tool_vuln_id ILIKE :search"
            ]
            query += " AND (" + " OR ".join(search_clauses) + ")"
            params["search"] = f"%{search}%"

        if severity and severity != "All Severities":
            query += " AND v.severity = :severity"
            params["severity"] = severity
        if status and status != "All Statuses":
            query += " AND av.status = :status"
            params["status"] = status
        if asset_type and asset_type != "All Asset Types":
            query += " AND a.asset_type = :asset_type"
            params["asset_type"] = asset_type
        if environment and environment != "All Environments":
            query += " AND a.environment = :environment"
            params["environment"] = environment

        query += " ORDER BY CASE v.severity WHEN 'Critical' THEN 4 WHEN 'High' THEN 3 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 1 ELSE 0 END DESC, av.last_seen DESC NULLS LAST"

        offset = (page - 1) * limit
        query += " LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset

        rows = db.execute(text(query), params).mappings().all()
        
        # Count query for pagination
        count_query = """
            SELECT COUNT(*)
            FROM asset_vulnerability av
            JOIN vulnerabilities v ON av.vuln_id = v.id
            JOIN assets a ON av.asset_id = a.id
            WHERE 1=1
        """
        count_params = {}
        
        if search:
            count_query += " AND (" + " OR ".join(search_clauses) + ")"
            count_params["search"] = f"%{search}%"
        if severity and severity != "All Severities":
            count_query += " AND v.severity = :severity"
            count_params["severity"] = severity
        if status and status != "All Statuses":
            count_query += " AND av.status = :status"
            count_params["status"] = status
        if asset_type and asset_type != "All Asset Types":
            count_query += " AND a.asset_type = :asset_type"
            count_params["asset_type"] = asset_type
        if environment and environment != "All Environments":
            count_query += " AND a.environment = :environment"
            count_params["environment"] = environment
            
        total = db.execute(text(count_query), count_params).scalar() or 0

        return {
            "data": [dict(r) for r in rows],
            "pagination": {
                "total": total,
                "page": page,
                "limit": limit,
                "totalPages": (total + limit - 1) // limit
            }
        }

# --- Get Single Vulnerability ---
@router.get("/vulnerabilities/{vulnerability_id}", response_model=VulnerabilityResponse)
def get_vulnerability(vulnerability_id: int):
    with SessionLocal() as db:
        # Get the vulnerability details
        vuln_row = db.execute(text("""
            SELECT v.*
            FROM vulnerabilities v
            WHERE v.id = :id LIMIT 1
        """), {"id": vulnerability_id}).mappings().first()
        
        if not vuln_row:
            raise HTTPException(status_code=404, detail="Vulnerability not found")
        
        # Get all assets affected by this vulnerability
        asset_rows = db.execute(text("""
            SELECT 
                av.id as av_id,
                av.status,
                av.first_seen,
                av.last_seen,
                av.evidence,
                av.plugin_output,
                av.tool_vuln_id,
                a.asset_name,
                a.ip_address,
                a.fqdn,
                a.asset_type,
                a.environment,
                a.criticality,
                a.region_or_site,
                a.owner,
                a.tags
            FROM asset_vulnerability av
            JOIN assets a ON av.asset_id = a.id
            WHERE av.vuln_id = :id
        """), {"id": vulnerability_id}).mappings().all()
        
        result = dict(vuln_row)
        result["affected_assets"] = [dict(r) for r in asset_rows]
        
        return {"data": result}

# --- Create Vulnerability ---
@router.post("/vulnerabilities", response_model=ApiResponse)
def create_vulnerability(vulnerability_data: VulnerabilityCreate):
    with SessionLocal() as db:
        try:
            insert_data = vulnerability_data.dict(exclude_unset=True)
            insert_data.setdefault("severity", "Medium")
            insert_data.setdefault("status", "Open")
            insert_data.setdefault("first_seen", datetime.now())
            insert_data.setdefault("last_seen", datetime.now())

            cols = ", ".join(insert_data.keys())
            vals = ", ".join([f":{c}" for c in insert_data.keys()])

            result = db.execute(
                text(f"INSERT INTO vulnerabilities ({cols}) VALUES ({vals}) RETURNING id"),
                insert_data
            )
            db.commit()
            new_id = result.scalar()

            return {"data": {"id": new_id}, "message": "Vulnerability created successfully"}

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Error creating vulnerability: {str(e)}")

# --- Update Vulnerability ---
@router.put("/vulnerabilities/{vulnerability_id}", response_model=ApiResponse)
def update_vulnerability(vulnerability_id: int, vulnerability_data: VulnerabilityUpdate):
    with SessionLocal() as db:
        try:
            existing = db.execute(
                text("SELECT id FROM vulnerabilities WHERE id = :id"),
                {"id": vulnerability_id}
            ).scalar()
            if not existing:
                raise HTTPException(status_code=404, detail="Vulnerability not found")

            update_data = vulnerability_data.dict(exclude_unset=True)
            if not update_data:
                return {"message": "No fields to update"}
            update_data["id"] = vulnerability_id

            set_clauses = [f"{field} = COALESCE(:{field}, {field})" for field in update_data if field != "id"]
            set_sql = ", ".join(set_clauses)

            db.execute(
                text(f"UPDATE vulnerabilities SET {set_sql} WHERE id = :id"),
                update_data
            )
            db.commit()

            return {"message": "Vulnerability updated successfully"}

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Error updating vulnerability: {str(e)}")

# --- Delete Vulnerability ---
@router.delete("/vulnerabilities/{vulnerability_id}", response_model=ApiResponse)
def delete_vulnerability(vulnerability_id: int):
    with SessionLocal() as db:
        try:
            existing = db.execute(
                text("SELECT id FROM vulnerabilities WHERE id = :id"),
                {"id": vulnerability_id}
            ).scalar()
            if not existing:
                raise HTTPException(status_code=404, detail="Vulnerability not found")

            db.execute(text("DELETE FROM vulnerabilities WHERE id = :id"), {"id": vulnerability_id})
            db.commit()
            return {"message": "Vulnerability deleted successfully"}

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Error deleting vulnerability: {str(e)}")

# --- Scan for Vulnerabilities ---
@router.post("/vulnerabilities/scan", response_model=ApiResponse)
def scan_vulnerabilities():
    with SessionLocal() as db:
        try:
            db.execute(text("""
                UPDATE vulnerabilities 
                SET last_seen = CURRENT_TIMESTAMP 
                WHERE status IN ('Open', 'In Progress', 'Muted')
            """))
            db.commit()
            return {
                "message": "Vulnerability scan initiated successfully",
                "scan_id": f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            }
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Error initiating scan: {str(e)}")

# --- Export Vulnerabilities ---
@router.get("/vulnerabilities/export", response_model=ApiResponse)
def export_vulnerabilities(
    format: str = Query("csv", description="Export format (csv, json)"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    status: Optional[str] = Query(None, description="Filter by status"),
    asset_type: Optional[str] = Query(None, description="Filter by asset type"),
    environment: Optional[str] = Query(None, description="Filter by environment")
):
    with SessionLocal() as db:
        query = "SELECT * FROM vulnerabilities WHERE 1=1"
        params = {}

        if severity and severity != "All Severities":
            query += " AND severity = :severity"
            params["severity"] = severity
        if status and status != "All Statuses":
            query += " AND status = :status"
            params["status"] = status
        if asset_type and asset_type != "All Asset Types":
            query += " AND asset_type = :asset_type"
            params["asset_type"] = asset_type
        if environment and environment != "All Environments":
            query += " AND environment = :environment"
            params["environment"] = environment

        query += " ORDER BY CASE severity WHEN 'Critical' THEN 4 WHEN 'High' THEN 3 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 1 ELSE 0 END DESC, last_seen DESC NULLS LAST"

        rows = db.execute(text(query), params).mappings().all()

        if format.lower() == "json":
            return {"data": [dict(r) for r in rows], "exported_at": datetime.now().isoformat()}
        else:
            return {"data": [dict(r) for r in rows], "format": "csv", "exported_at": datetime.now().isoformat()}
