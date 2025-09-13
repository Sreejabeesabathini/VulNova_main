from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import text
from db import SessionLocal
from typing import Optional
from datetime import datetime
from models import (
    AssetCreate, AssetUpdate, AssetResponse,
    PaginatedResponse, ApiResponse
)

router = APIRouter(prefix="/api", tags=["assets"])

# --- Get All Assets ---
@router.get("/assets", response_model=PaginatedResponse)
def get_assets(
    search: Optional[str] = Query(None, description="Search by asset_name, ip_address, fqdn, or external_id"),
    asset_type: Optional[str] = Query(None, description="Filter by asset type"),
    environment: Optional[str] = Query(None, description="Filter by environment"),
    criticality: Optional[str] = Query(None, description="Filter by criticality"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    with SessionLocal() as db:
        query = """
            SELECT 
                a.*,
                COUNT(av.id) as total_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Critical') AS critical_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'High') AS high_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Medium') AS medium_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Low') AS low_vulns
            FROM assets a
            LEFT JOIN asset_vulnerability av ON a.id = av.asset_id
            LEFT JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE 1=1
        """
        params = {}

        if search:
            search_clauses = [
                "a.asset_name ILIKE :search",
                "a.ip_address ILIKE :search", 
                "a.fqdn ILIKE :search",
                "a.external_id ILIKE :search"
            ]
            query += " AND (" + " OR ".join(search_clauses) + ")"
            params["search"] = f"%{search}%"

        if asset_type and asset_type != "All Asset Types":
            query += " AND a.asset_type = :asset_type"
            params["asset_type"] = asset_type
        if environment and environment != "All Environments":
            query += " AND a.environment = :environment"
            params["environment"] = environment
        if criticality and criticality != "All Criticalities":
            query += " AND a.criticality = :criticality"
            params["criticality"] = criticality

        query += " GROUP BY a.id ORDER BY a.asset_name"

        offset = (page - 1) * limit
        query += " LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset

        rows = db.execute(text(query), params).mappings().all()
        
        # Count query for pagination
        count_query = "SELECT COUNT(*) FROM assets a WHERE 1=1"
        count_params = {}
        
        if search:
            count_query += " AND (" + " OR ".join(search_clauses) + ")"
            count_params["search"] = f"%{search}%"
        if asset_type and asset_type != "All Asset Types":
            count_query += " AND a.asset_type = :asset_type"
            count_params["asset_type"] = asset_type
        if environment and environment != "All Environments":
            count_query += " AND a.environment = :environment"
            count_params["environment"] = environment
        if criticality and criticality != "All Criticalities":
            count_query += " AND a.criticality = :criticality"
            count_params["criticality"] = criticality
            
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

# --- Get Single Asset ---
@router.get("/assets/{asset_id}", response_model=ApiResponse)
def get_asset(asset_id: int):
    with SessionLocal() as db:
        row = db.execute(text("""
            SELECT 
                a.*,
                COUNT(av.id) as total_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Critical') AS critical_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'High') AS high_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Medium') AS medium_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Low') AS low_vulns
            FROM assets a
            LEFT JOIN asset_vulnerability av ON a.id = av.asset_id
            LEFT JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE a.id = :id
            GROUP BY a.id
        """), {"id": asset_id}).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Asset not found")
        return {"data": dict(row)}

# --- Create Asset ---
@router.post("/assets", response_model=ApiResponse)
def create_asset(asset_data: AssetCreate):
    with SessionLocal() as db:
        try:
            insert_data = asset_data.dict(exclude_unset=True)
            insert_data.setdefault("created_at", datetime.now())
            insert_data.setdefault("updated_at", datetime.now())

            cols = ", ".join(insert_data.keys())
            vals = ", ".join([f":{c}" for c in insert_data.keys()])

            result = db.execute(
                text(f"INSERT INTO assets ({cols}) VALUES ({vals}) RETURNING id"),
                insert_data
            )
            db.commit()
            new_id = result.scalar()

            return {"data": {"id": new_id}, "message": "Asset created successfully"}

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Error creating asset: {str(e)}")

# --- Update Asset ---
@router.put("/assets/{asset_id}", response_model=ApiResponse)
def update_asset(asset_id: int, asset_data: AssetUpdate):
    with SessionLocal() as db:
        try:
            existing = db.execute(
                text("SELECT id FROM assets WHERE id = :id"),
                {"id": asset_id}
            ).scalar()
            if not existing:
                raise HTTPException(status_code=404, detail="Asset not found")

            update_data = asset_data.dict(exclude_unset=True)
            if not update_data:
                return {"message": "No fields to update"}
            update_data["updated_at"] = datetime.now()
            update_data["id"] = asset_id

            set_clauses = [f"{field} = COALESCE(:{field}, {field})" for field in update_data if field != "id"]
            set_sql = ", ".join(set_clauses)

            db.execute(
                text(f"UPDATE assets SET {set_sql} WHERE id = :id"),
                update_data
            )
            db.commit()

            return {"message": "Asset updated successfully"}

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Error updating asset: {str(e)}")

# --- Delete Asset ---
@router.delete("/assets/{asset_id}", response_model=ApiResponse)
def delete_asset(asset_id: int):
    with SessionLocal() as db:
        try:
            existing = db.execute(
                text("SELECT id FROM assets WHERE id = :id"),
                {"id": asset_id}
            ).scalar()
            if not existing:
                raise HTTPException(status_code=404, detail="Asset not found")

            db.execute(text("DELETE FROM assets WHERE id = :id"), {"id": asset_id})
            db.commit()
            return {"message": "Asset deleted successfully"}

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Error deleting asset: {str(e)}")

# --- Asset Summary ---
@router.get("/assets-summary", response_model=ApiResponse)
def get_assets_summary():
    """Get asset summary by type, environment, and criticality."""
    with SessionLocal() as db:
        # Asset type breakdown
        asset_type_summary = db.execute(text("""
            SELECT 
                asset_type,
                COUNT(*) as count
            FROM assets
            WHERE asset_type IS NOT NULL
            GROUP BY asset_type
            ORDER BY count DESC;
        """)).mappings().all()

        # Environment breakdown
        environment_summary = db.execute(text("""
            SELECT 
                environment,
                COUNT(*) as count
            FROM assets
            WHERE environment IS NOT NULL
            GROUP BY environment
            ORDER BY count DESC;
        """)).mappings().all()

        # Criticality breakdown
        criticality_summary = db.execute(text("""
            SELECT 
                criticality,
                COUNT(*) as count
            FROM assets
            WHERE criticality IS NOT NULL
            GROUP BY criticality
            ORDER BY count DESC;
        """)).mappings().all()

        return {
            "data": {
                "asset_types": [dict(r) for r in asset_type_summary],
                "environments": [dict(r) for r in environment_summary],
                "criticalities": [dict(r) for r in criticality_summary]
            }
        }
