from fastapi import APIRouter
from sqlalchemy import text
from db import SessionLocal

router = APIRouter(prefix="/api", tags=["dashboard"])


# --- Dashboard Summary ---
@router.get("/dashboard-summary")
def get_dashboard_summary():
    with SessionLocal() as db:
        # ✅ Total assets
        total_assets = db.execute(text("SELECT COUNT(*) FROM assets;")).scalar() or 0

        # ✅ Total threats
        total_threats = db.execute(text("SELECT COUNT(*) FROM threat_intelligence;")).scalar() or 0

        # ✅ Vulnerability breakdown
        vulns = db.execute(text("""
            SELECT
                COUNT(*) FILTER (WHERE severity = 'Critical') AS critical,
                COUNT(*) FILTER (WHERE severity = 'High') AS high,
                COUNT(*) FILTER (WHERE severity = 'Medium') AS medium,
                COUNT(*) FILTER (WHERE severity = 'Low') AS low
            FROM vulnerabilities;
        """)).mappings().first()

        vulns = dict(vulns) if vulns else {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0
        }

        # ✅ Risk score (avg from assets)
        risk_score = db.execute(text("SELECT COALESCE(AVG(risk_score), 0) FROM assets;")).scalar() or 0

        return {
            "data": {
                "totalAssets": total_assets,
                "totalThreats": total_threats,
                "riskScore": int(risk_score),
                "vulnerabilities": {
                    "critical_vulns": vulns.get("critical", 0),
                    "high_vulns": vulns.get("high", 0),
                    "medium_vulns": vulns.get("medium", 0),
                    "low_vulns": vulns.get("low", 0),
                },
            }
        }


# --- Riskiest Assets ---
@router.get("/riskiest-assets")
def get_riskiest_assets():
    with SessionLocal() as db:
        rows = db.execute(text("""
            SELECT 
                id,
                name,
                ip_address,
                location,
                asset_type,
                risk_score,
                critical_vulns,
                high_vulns,
                medium_vulns,
                low_vulns,
                status,
                last_seen
            FROM assets
            ORDER BY risk_score DESC
            LIMIT 10;
        """)).mappings().all()

        return {"data": [dict(r) for r in rows]}


# --- Recent Vulnerabilities ---
@router.get("/recent-vulnerabilities")
def get_recent_vulnerabilities():
    with SessionLocal() as db:
        rows = db.execute(text("""
            SELECT id, cve_id, severity, description, discovered_at
            FROM vulnerabilities
            ORDER BY discovered_at DESC
            LIMIT 10;
        """)).mappings().all()

        return {"data": [dict(r) for r in rows]}


# --- Threat Intelligence ---
@router.get("/threat-intelligence")
def get_threat_intelligence():
    with SessionLocal() as db:
        rows = db.execute(text("""
            SELECT id, title, severity, source, date
            FROM threat_intelligence
            ORDER BY date DESC
            LIMIT 10;
        """)).mappings().all()

        return {"data": [dict(r) for r in rows]}
