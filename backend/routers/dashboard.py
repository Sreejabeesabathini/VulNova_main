from fastapi import APIRouter
from sqlalchemy import text
from db import SessionLocal
from models import (
    DashboardSummary, AssetVulnerabilitySummary, VulnerabilityTrends,
    ApiResponse
)

router = APIRouter(prefix="/api", tags=["dashboard"])


def calculate_comprehensive_risk_score(db):
    """
    Calculate comprehensive risk score based on:
    1. Vulnerability severity and count
    2. Asset criticality and exposure
    3. Environment risk factors
    4. Threat intelligence
    """
    
    # 1. Vulnerability Risk Score (0-500 points)
    vuln_risk = db.execute(text("""
        SELECT COALESCE(SUM(
            CASE v.severity
                WHEN 'Critical' THEN 100
                WHEN 'High' THEN 50
                WHEN 'Medium' THEN 25
                WHEN 'Low' THEN 10
                ELSE 0
            END
        ), 0)
        FROM asset_vulnerability av
        JOIN vulnerabilities v ON av.vuln_id = v.id
        WHERE av.status IN ('Open', 'In Progress')
    """)).scalar() or 0
    
    # 2. Asset Criticality Risk Score (0-200 points)
    asset_risk = db.execute(text("""
        SELECT COALESCE(SUM(
            CASE a.criticality
                WHEN 'Tier 1' THEN 50
                WHEN 'Tier 2' THEN 30
                WHEN 'Tier 3' THEN 15
                ELSE 5
            END
        ), 0)
        FROM assets a
        WHERE a.environment IN ('Prod', 'Production')
    """)).scalar() or 0
    
    # 3. Environment Risk Multiplier
    env_risk_multiplier = db.execute(text("""
        SELECT 
            CASE 
                WHEN COUNT(*) FILTER (WHERE environment = 'Prod') > COUNT(*) FILTER (WHERE environment IN ('Test', 'Dev')) 
                THEN 1.5  -- Production-heavy environment
                ELSE 1.0  -- Balanced or dev-heavy environment
            END
        FROM assets
    """)).scalar() or 1.0
    
    # 4. Threat Intelligence Risk Score (0-100 points)
    threat_risk = db.execute(text("""
        SELECT COALESCE(SUM(
            CASE severity
                WHEN 'Critical' THEN 25
                WHEN 'High' THEN 15
                WHEN 'Medium' THEN 10
                WHEN 'Low' THEN 5
                ELSE 0
            END
        ), 0)
        FROM threat_intelligence
        WHERE status = 'active'
    """)).scalar() or 0
    
    # 5. High-Risk Asset Concentration (0-100 points)
    high_risk_concentration = db.execute(text("""
        SELECT COALESCE(
            (COUNT(*) FILTER (WHERE a.criticality = 'Tier 1' AND a.environment = 'Prod') * 10), 0
        )
        FROM assets a
    """)).scalar() or 0
    
    # 6. Vulnerability Density Risk (0-100 points)
    vuln_density = db.execute(text("""
        SELECT COALESCE(
            (COUNT(av.id) * 2), 0
        )
        FROM asset_vulnerability av
        JOIN assets a ON av.asset_id = a.id
        WHERE a.environment = 'Prod'
    """)).scalar() or 0
    
    # Calculate total risk score
    base_risk = vuln_risk + asset_risk + threat_risk + high_risk_concentration + vuln_density
    total_risk = int(base_risk * env_risk_multiplier)
    
    # Cap the risk score at 2000 for display purposes
    return min(total_risk, 2000)


def get_risk_score_breakdown(db):
    """
    Get detailed breakdown of risk score components for analysis
    """
    
    # 1. Vulnerability Risk Score
    vuln_risk = db.execute(text("""
        SELECT COALESCE(SUM(
            CASE v.severity
                WHEN 'Critical' THEN 100
                WHEN 'High' THEN 50
                WHEN 'Medium' THEN 25
                WHEN 'Low' THEN 10
                ELSE 0
            END
        ), 0)
        FROM asset_vulnerability av
        JOIN vulnerabilities v ON av.vuln_id = v.id
        WHERE av.status IN ('Open', 'In Progress')
    """)).scalar() or 0
    
    # 2. Asset Criticality Risk Score
    asset_risk = db.execute(text("""
        SELECT COALESCE(SUM(
            CASE a.criticality
                WHEN 'Tier 1' THEN 50
                WHEN 'Tier 2' THEN 30
                WHEN 'Tier 3' THEN 15
                ELSE 5
            END
        ), 0)
        FROM assets a
        WHERE a.environment IN ('Prod', 'Production')
    """)).scalar() or 0
    
    # 3. Environment Risk Multiplier
    env_risk_multiplier = db.execute(text("""
        SELECT 
            CASE 
                WHEN COUNT(*) FILTER (WHERE environment = 'Prod') > COUNT(*) FILTER (WHERE environment IN ('Test', 'Dev')) 
                THEN 1.5
                ELSE 1.0
            END
        FROM assets
    """)).scalar() or 1.0
    
    # 4. Threat Intelligence Risk Score
    threat_risk = db.execute(text("""
        SELECT COALESCE(SUM(
            CASE severity
                WHEN 'Critical' THEN 25
                WHEN 'High' THEN 15
                WHEN 'Medium' THEN 10
                WHEN 'Low' THEN 5
                ELSE 0
            END
        ), 0)
        FROM threat_intelligence
        WHERE status = 'active'
    """)).scalar() or 0
    
    # 5. High-Risk Asset Concentration
    high_risk_concentration = db.execute(text("""
        SELECT COALESCE(
            (COUNT(*) FILTER (WHERE a.criticality = 'Tier 1' AND a.environment = 'Prod') * 10), 0
        )
        FROM assets a
    """)).scalar() or 0
    
    # 6. Vulnerability Density Risk
    vuln_density = db.execute(text("""
        SELECT COALESCE(
            (COUNT(av.id) * 2), 0
        )
        FROM asset_vulnerability av
        JOIN assets a ON av.asset_id = a.id
        WHERE a.environment = 'Prod'
    """)).scalar() or 0
    
    # Calculate totals
    base_risk = vuln_risk + asset_risk + threat_risk + high_risk_concentration + vuln_density
    total_risk = int(base_risk * env_risk_multiplier)
    final_risk = min(total_risk, 2000)
    
    return {
        "vulnerability_risk": vuln_risk,
        "asset_risk": asset_risk,
        "threat_risk": threat_risk,
        "high_risk_concentration": high_risk_concentration,
        "vulnerability_density": vuln_density,
        "environment_multiplier": env_risk_multiplier,
        "base_risk": base_risk,
        "total_risk": total_risk,
        "final_risk_score": final_risk
    }


# --- Dashboard Summary ---
@router.get("/dashboard-summary", response_model=ApiResponse)
def get_dashboard_summary():
    with SessionLocal() as db:
        # ✅ Total assets (unique asset names)
        total_assets = db.execute(text("SELECT COUNT(DISTINCT asset_name) FROM assets WHERE asset_name IS NOT NULL;")).scalar() or 0

        # ✅ Active threats only
        active_threats = db.execute(text("""
            SELECT COUNT(*) FROM threat_intelligence WHERE status = 'active';
        """)).scalar() or 0


        # ✅ Vulnerability breakdown (only open/in-progress from asset_vulnerability junction table)
        vulns = db.execute(text("""
            SELECT
                COUNT(*) FILTER (WHERE v.severity = 'Critical') AS critical,
                COUNT(*) FILTER (WHERE v.severity = 'High') AS high,
                COUNT(*) FILTER (WHERE v.severity = 'Medium') AS medium,
                COUNT(*) FILTER (WHERE v.severity = 'Low') AS low
            FROM asset_vulnerability av
            JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE av.status IN ('Open', 'In Progress');
        """)).mappings().first()

        vulns = dict(vulns) if vulns else {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0
        }

        # ✅ Comprehensive risk score calculation
        risk_score = calculate_comprehensive_risk_score(db)

        return {
            "data": {
                "totalAssets": total_assets,  # ✅ camelCase for frontend
                "totalThreats": active_threats,   #ge 
                "riskScore": int(risk_score),  # ✅ camelCase for frontend
                "vulnerabilities": {
                    "critical": vulns.get("critical", 0),  # ✅ match frontend types
                    "high": vulns.get("high", 0),  # ✅ match frontend types
                    "medium": vulns.get("medium", 0),  # ✅ match frontend types
                    "low": vulns.get("low", 0),  # ✅ match frontend types
                 },
            }
        }

# --- Riskiest Assets ---
@router.get("/riskiest-assets", response_model=ApiResponse)
def get_riskiest_assets():
    with SessionLocal() as db:
        rows = db.execute(text("""
            SELECT 
                a.id,
                a.asset_name,
                a.ip_address,
                a.fqdn,
                a.asset_type,
                a.environment,
                a.criticality,
                a.region_or_site,
                a.owner,
                a.created_at,
                a.updated_at,
                MAX(av.last_seen) as last_seen,
                COUNT(av.id) as total_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Critical') AS critical_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'High') AS high_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Medium') AS medium_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Low') AS low_vulns,
                CASE 
                    WHEN a.tags ILIKE '%internet-facing%' THEN 1 
                    ELSE 0 
                END as is_internet_facing,
                -- Calculate risk score based on vulnerabilities and asset criticality
                (
                    COALESCE(COUNT(av.id) FILTER (WHERE v.severity = 'Critical'), 0) * 100 +
                    COALESCE(COUNT(av.id) FILTER (WHERE v.severity = 'High'), 0) * 50 +
                    COALESCE(COUNT(av.id) FILTER (WHERE v.severity = 'Medium'), 0) * 25 +
                    COALESCE(COUNT(av.id) FILTER (WHERE v.severity = 'Low'), 0) * 10 +
                    CASE a.criticality
                        WHEN 'Tier 1' THEN 200
                        WHEN 'Tier 2' THEN 100
                        WHEN 'Tier 3' THEN 50
                        ELSE 25
                    END +
                    CASE 
                        WHEN a.tags ILIKE '%internet-facing%' THEN 150
                        ELSE 0
                    END
                ) as risk_score
            FROM assets a
            LEFT JOIN asset_vulnerability av ON a.id = av.asset_id
            LEFT JOIN vulnerabilities v ON av.vuln_id = v.id
            GROUP BY a.id, a.asset_name, a.ip_address, a.fqdn, a.asset_type, 
                     a.environment, a.criticality, a.region_or_site, a.owner, 
                     a.created_at, a.updated_at, a.tags
            ORDER BY is_internet_facing DESC, risk_score DESC, critical_vulns DESC
            LIMIT 10;
        """)).mappings().all()

        return {"data": [dict(r) for r in rows]}


# --- Recent Vulnerabilities ---
@router.get("/recent-vulnerabilities", response_model=ApiResponse)
def get_recent_vulnerabilities():
    with SessionLocal() as db:
        rows = db.execute(text("""
            SELECT 
                av.id,
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
                a.environment
            FROM asset_vulnerability av
            JOIN vulnerabilities v ON av.vuln_id = v.id
            JOIN assets a ON av.asset_id = a.id
            ORDER BY av.first_seen DESC NULLS LAST, av.last_seen DESC NULLS LAST
            LIMIT 10;
        """)).mappings().all()

        return {"data": [dict(r) for r in rows]}


# --- Threat Intelligence ---
@router.get("/threat-intelligence", response_model=ApiResponse)
def get_threat_intelligence():
    with SessionLocal() as db:
        rows = db.execute(text("""
            SELECT id, title, severity, source, date
            FROM threat_intelligence
            ORDER BY date DESC
            LIMIT 10;
        """)).mappings().all()

        return {"data": [dict(r) for r in rows]}

# --- Asset Vulnerability Summary ---
@router.get("/asset-vulnerability-summary", response_model=ApiResponse)
def get_asset_vulnerability_summary():
    """Get vulnerability summary by asset type and environment"""
    with SessionLocal() as db:
        # Asset type breakdown
        asset_type_summary = db.execute(text("""
            SELECT 
                a.asset_type,
                COUNT(av.id) as total_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Critical') AS critical,
                COUNT(av.id) FILTER (WHERE v.severity = 'High') AS high,
                COUNT(av.id) FILTER (WHERE v.severity = 'Medium') AS medium,
                COUNT(av.id) FILTER (WHERE v.severity = 'Low') AS low
            FROM assets a
            LEFT JOIN asset_vulnerability av ON a.id = av.asset_id
            LEFT JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE a.asset_type IS NOT NULL
            GROUP BY a.asset_type
            ORDER BY total_vulns DESC;
        """)).mappings().all()

        # Environment breakdown
        environment_summary = db.execute(text("""
            SELECT 
                a.environment,
                COUNT(av.id) as total_vulns,
                COUNT(av.id) FILTER (WHERE v.severity = 'Critical') AS critical,
                COUNT(av.id) FILTER (WHERE v.severity = 'High') AS high,
                COUNT(av.id) FILTER (WHERE v.severity = 'Medium') AS medium,
                COUNT(av.id) FILTER (WHERE v.severity = 'Low') AS low
            FROM assets a
            LEFT JOIN asset_vulnerability av ON a.id = av.asset_id
            LEFT JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE a.environment IS NOT NULL
            GROUP BY a.environment
            ORDER BY total_vulns DESC;
        """)).mappings().all()

        # Top vulnerable assets
        top_vulnerable_assets = db.execute(text("""
            SELECT 
                a.asset_name,
                a.fqdn,
                a.ip_address,
                a.asset_type,
                a.environment,
                COUNT(av.id) as vuln_count,
                COUNT(av.id) FILTER (WHERE v.severity = 'Critical') AS critical_count,
                COUNT(av.id) FILTER (WHERE v.severity = 'High') AS high_count
            FROM assets a
            LEFT JOIN asset_vulnerability av ON a.id = av.asset_id
            LEFT JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE a.asset_name IS NOT NULL
            GROUP BY a.id, a.asset_name, a.fqdn, a.ip_address, a.asset_type, a.environment
            ORDER BY vuln_count DESC, critical_count DESC, high_count DESC
            LIMIT 10;
        """)).mappings().all()

        return {
            "data": {
                "asset_types": [dict(r) for r in asset_type_summary],
                "environments": [dict(r) for r in environment_summary],
                "top_vulnerable_assets": [dict(r) for r in top_vulnerable_assets]
            }
        }

# --- Vulnerability Trends ---
@router.get("/vulnerability-trends", response_model=ApiResponse)
def get_vulnerability_trends():
    """Get vulnerability trends over time"""
    with SessionLocal() as db:
        # Monthly trends (last 12 months)
        monthly_trends = db.execute(text("""
            SELECT 
                DATE_TRUNC('month', av.first_seen) as month,
                COUNT(*) as total_vulns,
                COUNT(*) FILTER (WHERE v.severity = 'Critical') AS critical,
                COUNT(*) FILTER (WHERE v.severity = 'High') AS high,
                COUNT(*) FILTER (WHERE v.severity = 'Medium') AS medium,
                COUNT(*) FILTER (WHERE v.severity = 'Low') AS low
            FROM asset_vulnerability av
            JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE av.first_seen >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY DATE_TRUNC('month', av.first_seen)
            ORDER BY month DESC;
        """)).mappings().all()

        # Source breakdown
        source_breakdown = db.execute(text("""
            SELECT 
                v.source,
                COUNT(*) as total_vulns,
                COUNT(*) FILTER (WHERE v.severity = 'Critical') AS critical,
                COUNT(*) FILTER (WHERE v.severity = 'High') AS high,
                COUNT(*) FILTER (WHERE v.severity = 'Medium') AS medium,
                COUNT(*) FILTER (WHERE v.severity = 'Low') AS low
            FROM asset_vulnerability av
            JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE v.source IS NOT NULL
            GROUP BY v.source
            ORDER BY total_vulns DESC;
        """)).mappings().all()

        return {
            "data": {
                "monthly_trends": [dict(r) for r in monthly_trends],
                "source_breakdown": [dict(r) for r in source_breakdown]
            }
        }


# --- Risk Score Breakdown ---
@router.get("/risk-score-breakdown", response_model=ApiResponse)
def get_risk_score_breakdown_endpoint():
    """Get detailed breakdown of risk score calculation"""
    with SessionLocal() as db:
        breakdown = get_risk_score_breakdown(db)
        return {"data": breakdown}


# --- Asset Dashboard Endpoints ---
@router.get("/asset-dashboard-metrics", response_model=ApiResponse)
def get_asset_dashboard_metrics():
    """Get key metrics for asset dashboard"""
    with SessionLocal() as db:
        # Total Assets
        total_assets = db.execute(text("SELECT COUNT(*) FROM assets")).scalar() or 0
        
        # Active Assets (assets with recent activity or vulnerabilities)
        active_assets = db.execute(text("""
            SELECT COUNT(DISTINCT a.id)
            FROM assets a
            LEFT JOIN asset_vulnerability av ON a.id = av.asset_id
            WHERE av.last_seen >= NOW() - INTERVAL '30 days' OR av.last_seen IS NULL
        """)).scalar() or 0
        
        # High Risk Assets (Tier 1 with vulnerabilities)
        high_risk_assets = db.execute(text("""
            SELECT COUNT(DISTINCT a.id)
            FROM assets a
            JOIN asset_vulnerability av ON a.id = av.asset_id
            JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE a.criticality = 'Tier 1' AND v.severity IN ('Critical', 'High')
        """)).scalar() or 0
        
        # Protected Assets (assets with no critical/high vulnerabilities)
        protected_assets = db.execute(text("""
            SELECT COUNT(DISTINCT a.id)
            FROM assets a
            LEFT JOIN asset_vulnerability av ON a.id = av.asset_id
            LEFT JOIN vulnerabilities v ON av.vuln_id = v.id AND v.severity IN ('Critical', 'High')
            WHERE v.id IS NULL
        """)).scalar() or 0
        
        return {
            "data": {
                "totalAssets": total_assets,
                "activeAssets": active_assets,
                "highRiskAssets": high_risk_assets,
                "protectedAssets": protected_assets
            }
        }


@router.get("/asset-types-distribution", response_model=ApiResponse)
def get_asset_types_distribution():
    """Get asset types distribution"""
    with SessionLocal() as db:
        # Get asset type counts
        asset_types = db.execute(text("""
            SELECT 
                COALESCE(asset_type, 'Other') as asset_type,
                COUNT(*) as count
            FROM assets
            GROUP BY COALESCE(asset_type, 'Other')
            ORDER BY count DESC
        """)).mappings().all()
        
        total_assets = sum(row['count'] for row in asset_types)
        
        # Calculate percentages
        distribution = []
        for row in asset_types:
            percentage = (row['count'] / total_assets * 100) if total_assets > 0 else 0
            distribution.append({
                "name": row['asset_type'],
                "count": row['count'],
                "percentage": round(percentage, 1)
            })
        
        return {"data": distribution}


@router.get("/risk-distribution", response_model=ApiResponse)
def get_risk_distribution():
    """Get risk distribution based on asset vulnerabilities"""
    with SessionLocal() as db:
        # Get risk distribution with normalized severity levels
        risk_dist = db.execute(text("""
            WITH normalized_risks AS (
                SELECT 
                    a.id as asset_id,
                    CASE 
                        WHEN v.severity IS NULL THEN 'None'
                        WHEN UPPER(v.severity) = 'CRITICAL' THEN 'Critical'
                        WHEN UPPER(v.severity) = 'HIGH' THEN 'High'
                        WHEN UPPER(v.severity) = 'MEDIUM' THEN 'Medium'
                        WHEN UPPER(v.severity) = 'LOW' THEN 'Low'
                        WHEN UPPER(v.severity) = 'INFO' THEN 'Info'
                        WHEN UPPER(v.severity) = 'MAJOR' THEN 'High'
                        WHEN UPPER(v.severity) = 'MINOR' THEN 'Low'
                        WHEN UPPER(v.severity) = 'BLOCKER' THEN 'Critical'
                        ELSE v.severity
                    END as risk_level
                FROM assets a
                LEFT JOIN asset_vulnerability av ON a.id = av.asset_id
                LEFT JOIN vulnerabilities v ON av.vuln_id = v.id
            )
            SELECT 
                risk_level,
                COUNT(DISTINCT asset_id) as count
            FROM normalized_risks
            GROUP BY risk_level
            ORDER BY 
                CASE risk_level
                    WHEN 'Critical' THEN 1
                    WHEN 'High' THEN 2
                    WHEN 'Medium' THEN 3
                    WHEN 'Low' THEN 4
                    WHEN 'None' THEN 5
                    WHEN 'Info' THEN 6
                    ELSE 7
                END
        """)).mappings().all()
        
        total_assets = sum(row['count'] for row in risk_dist)
        
        # Calculate percentages
        distribution = []
        for row in risk_dist:
            percentage = (row['count'] / total_assets * 100) if total_assets > 0 else 0
            distribution.append({
                "level": row['risk_level'],
                "count": row['count'],
                "percentage": round(percentage, 1)
            })
        
        return {"data": distribution}


@router.get("/cloud-status", response_model=ApiResponse)
def get_cloud_status():
    """Get public cloud status breakdown"""
    with SessionLocal() as db:
        # Get cloud provider distribution (using source as cloud provider)
        cloud_data = db.execute(text("""
            SELECT 
                COALESCE(source, 'Unknown') as provider,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE environment = 'Prod') as production,
                COUNT(*) FILTER (WHERE criticality = 'Tier 1') as critical
            FROM assets
            GROUP BY COALESCE(source, 'Unknown')
            ORDER BY total DESC
        """)).mappings().all()
        
        # Calculate status breakdown
        total_assets = sum(row['total'] for row in cloud_data)
        reporting_assets = sum(row['production'] for row in cloud_data)
        critical_assets = sum(row['critical'] for row in cloud_data)
        
        return {
            "data": {
                "total": total_assets,
                "reporting": reporting_assets,
                "critical": critical_assets,
                "providers": [dict(row) for row in cloud_data]
            }
        }


@router.get("/recent-activity", response_model=ApiResponse)
def get_recent_activity(timeframe: str = "7d"):
    """Get recent activity feed with timeframe filtering"""
    with SessionLocal() as db:
        # Map timeframe to SQL interval
        interval_map = {
            "1h": "1 hour",
            "24h": "24 hours", 
            "7d": "7 days",
            "30d": "30 days",
            "90d": "90 days"
        }
        
        interval = interval_map.get(timeframe, "7 days")
        
        # Get recent vulnerability discoveries and updates
        recent_activity = db.execute(text(f"""
            SELECT 
                av.id,
                a.asset_name as asset,
                CONCAT('Vulnerability ', v.severity, ' - ', v.name) as action,
                av.last_seen as timestamp,
                CASE 
                    WHEN UPPER(v.severity) IN ('CRITICAL', 'BLOCKER') THEN 'error'
                    WHEN UPPER(v.severity) IN ('HIGH', 'MAJOR') THEN 'warning'
                    WHEN UPPER(v.severity) = 'MEDIUM' THEN 'info'
                    ELSE 'success'
                END as status,
                'system' as user
            FROM asset_vulnerability av
            JOIN assets a ON av.asset_id = a.id
            JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE av.last_seen >= NOW() - INTERVAL '{interval}'
            ORDER BY av.last_seen DESC
            LIMIT 20
        """)).mappings().all()
        
        # Format timestamps
        activities = []
        for row in recent_activity:
            activity = dict(row)
            if activity['timestamp']:
                # Calculate relative time
                from datetime import datetime, timezone
                now = datetime.now(timezone.utc)
                if activity['timestamp'].tzinfo is None:
                    activity['timestamp'] = activity['timestamp'].replace(tzinfo=timezone.utc)
                
                diff = now - activity['timestamp']
                if diff.days > 0:
                    activity['timestamp'] = f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
                elif diff.seconds > 3600:
                    hours = diff.seconds // 3600
                    activity['timestamp'] = f"{hours} hour{'s' if hours > 1 else ''} ago"
                elif diff.seconds > 60:
                    minutes = diff.seconds // 60
                    activity['timestamp'] = f"{minutes} minute{'s' if minutes > 1 else ''} ago"
                else:
                    activity['timestamp'] = "Just now"
            else:
                activity['timestamp'] = "Unknown"
            
            activities.append(activity)
        
        return {"data": activities}


@router.get("/quick-statistics", response_model=ApiResponse)
def get_quick_statistics():
    """Get quick statistics for dashboard"""
    with SessionLocal() as db:
        # Calculate uptime (assets with recent activity)
        uptime_assets = db.execute(text("""
            SELECT COUNT(DISTINCT a.id)
            FROM assets a
            JOIN asset_vulnerability av ON a.id = av.asset_id
            WHERE av.last_seen >= NOW() - INTERVAL '24 hours'
        """)).scalar() or 0
        
        total_assets = db.execute(text("SELECT COUNT(*) FROM assets")).scalar() or 0
        uptime_percentage = (uptime_assets / total_assets * 100) if total_assets > 0 else 0
        
        # Calculate coverage (assets with vulnerabilities detected)
        covered_assets = db.execute(text("""
            SELECT COUNT(DISTINCT a.id)
            FROM assets a
            JOIN asset_vulnerability av ON a.id = av.asset_id
        """)).scalar() or 0
        coverage_percentage = (covered_assets / total_assets * 100) if total_assets > 0 else 0
        
        # Calculate average response time (mock for now)
        avg_response = 2.3
        
        # Count active alerts (critical/high vulnerabilities)
        active_alerts = db.execute(text("""
            SELECT COUNT(*)
            FROM asset_vulnerability av
            JOIN vulnerabilities v ON av.vuln_id = v.id
            WHERE v.severity IN ('Critical', 'High') AND av.status IN ('Open', 'In Progress')
        """)).scalar() or 0
        
        return {
            "data": {
                "uptime": round(uptime_percentage, 1),
                "coverage": round(coverage_percentage, 1),
                "avgResponse": avg_response,
                "alerts": active_alerts
            }
        }
