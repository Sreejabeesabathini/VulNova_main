from fastapi import APIRouter, Query
from sqlalchemy import text
from typing import Optional
from db import SessionLocal

router = APIRouter(prefix="/api", tags=["threat_intelligence"])


def _has_column(db, table: str, column: str) -> bool:
    return db.execute(text(
        """
        SELECT 1 FROM information_schema.columns
        WHERE table_name = :t AND column_name = :c LIMIT 1
        """
    ), {"t": table, "c": column}).scalar() is not None


@router.get("/threats-summary")
def get_threats_summary():
    with SessionLocal() as db:
        total = db.execute(text("SELECT COUNT(*) FROM threat_intelligence"))\
            .scalar() or 0

        active = 0
        inactive = 0
        if _has_column(db, "threat_intelligence", "status"):
            active = db.execute(text(
                "SELECT COUNT(*) FROM threat_intelligence WHERE status = 'active'"
            )).scalar() or 0
            inactive = db.execute(text(
                "SELECT COUNT(*) FROM threat_intelligence WHERE status = 'inactive'"
            )).scalar() or 0

        critical = db.execute(text(
            "SELECT COUNT(*) FROM threat_intelligence WHERE severity = 'Critical'"
        )).scalar() or 0

        contained = inactive

        return {"data": {"total": total, "active": active, "critical": critical, "contained": contained}}


@router.get("/threats-trends")
def get_threats_trends():
    """Week-over-week percentage change by type using reported_at.
    Returns malware, phishing, ransomware, apt with fields {percentage, trend}.
    If columns missing, returns zeros.
    """
    with SessionLocal() as db:
        has_type = _has_column(db, "threat_intelligence", "type")
        has_reported_at = _has_column(db, "threat_intelligence", "reported_at")
        if not (has_type and has_reported_at):
            return {"data": {
                "malware": {"trend": "stable", "percentage": 0},
                "phishing": {"trend": "stable", "percentage": 0},
                "ransomware": {"trend": "stable", "percentage": 0},
                "apt": {"trend": "stable", "percentage": 0},
            }}

        def fetch_counts(t: str):
            # Last 7 days
            last = db.execute(text(
                """
                SELECT COUNT(*) FROM threat_intelligence
                WHERE type = :t AND reported_at >= NOW() - INTERVAL '7 days'
                """
            ), {"t": t}).scalar() or 0
            # Previous 7 days window
            prev = db.execute(text(
                """
                SELECT COUNT(*) FROM threat_intelligence
                WHERE type = :t AND reported_at >= NOW() - INTERVAL '14 days'
                  AND reported_at < NOW() - INTERVAL '7 days'
                """
            ), {"t": t}).scalar() or 0
            return last, prev

        def pct_and_trend(last: int, prev: int):
            if prev == 0 and last == 0:
                return 0, "stable"
            if prev == 0:
                return 100, "up"
            diff = last - prev
            pct = round(abs(diff) * 100 / prev)
            trend = "up" if diff > 0 else ("down" if diff < 0 else "stable")
            return pct, trend

        out = {}
        for label, t in {"malware": "Malware", "phishing": "Phishing", "ransomware": "Ransomware", "apt": "APT"}.items():
            last, prev = fetch_counts(t)
            pct, trend = pct_and_trend(last, prev)
            out[label] = {"percentage": pct, "trend": trend}

        return {"data": out}


@router.get("/threats")
def list_threats(
    search: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    with SessionLocal() as db:
        has_status = _has_column(db, "threat_intelligence", "status")
        has_reported_at = _has_column(db, "threat_intelligence", "reported_at")

        # Optional extended columns
        has_type = _has_column(db, "threat_intelligence", "type")
        has_target = _has_column(db, "threat_intelligence", "target")
        has_indicators = _has_column(db, "threat_intelligence", "indicators")
        has_mitigation = _has_column(db, "threat_intelligence", "mitigation")
        has_confidence = _has_column(db, "threat_intelligence", "confidence")

        cols = ["id", "title", "severity", "source"]
        if has_type:
            cols.append("type")
        if has_status:
            cols.append("status")
        if has_reported_at:
            cols.append("reported_at")
        if has_target:
            cols.append("target")
        if has_indicators:
            cols.append("indicators")
        if has_mitigation:
            cols.append("mitigation")
        if has_confidence:
            cols.append("confidence")

        base = f"SELECT {', '.join(cols)} FROM threat_intelligence WHERE 1=1"
        params = {}
        if search:
            base += " AND (title ILIKE :s OR source ILIKE :s)"
            params["s"] = f"%{search}%"
        if severity:
            base += " AND severity = :sev"
            params["sev"] = severity
        if status and has_status:
            base += " AND status = :st"
            params["st"] = status
        if type and has_type:
            base += " AND type = :tp"
            params["tp"] = type

        if has_reported_at:
            base += " ORDER BY reported_at DESC"
        else:
            base += " ORDER BY id DESC"

        offset = (page - 1) * limit
        base += " LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset

        rows = db.execute(text(base), params).mappings().all()

        count_q = "SELECT COUNT(*) FROM threat_intelligence WHERE 1=1"
        count_params = {}
        if search:
            count_q += " AND (title ILIKE :s OR source ILIKE :s)"
            count_params["s"] = f"%{search}%"
        if severity:
            count_q += " AND severity = :sev"
            count_params["sev"] = severity
        if status and has_status:
            count_q += " AND status = :st"
            count_params["st"] = status
        if type and has_type:
            count_q += " AND type = :tp"
            count_params["tp"] = type
        total = db.execute(text(count_q), count_params).scalar() or 0

        data = []
        for r in rows:
            item = dict(r)
            data.append({
                "id": item.get("id"),
                "name": item.get("title"),
                "type": item.get("type") or (type or "Malware"),
                "severity": item.get("severity"),
                "status": (item.get("status") or "active").capitalize() if has_status else "Active",
                "source": item.get("source") or "External",
                "target": item.get("target") or "Infrastructure",
                "firstSeen": item.get("reported_at"),
                "lastSeen": item.get("reported_at"),
                "affectedAssets": 0,
                "description": item.get("title"),
                "indicators": item.get("indicators") or [],
                "mitigation": item.get("mitigation") or "",
                "confidence": int(item.get("confidence")) if item.get("confidence") is not None else 80,
            })

        return {"data": data, "pagination": {"total": total, "page": page, "limit": limit, "totalPages": (total + limit - 1) // limit}}
