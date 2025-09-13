from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# --- Vulnerability Models ---
class VulnerabilityBase(BaseModel):
    """Base vulnerability model matching the actual database schema"""
    # Primary key
    id: Optional[int] = None
    
    # Core vulnerability fields (standalone)
    vuln_identifier: Optional[str] = Field(None, max_length=255)
    name: Optional[str] = Field(None, max_length=255)
    cve: Optional[str] = Field(None, max_length=50)
    cwe: Optional[str] = Field(None, max_length=50)
    owasp: Optional[str] = Field(None, max_length=255)
    severity: Optional[str] = Field(None, max_length=50)
    cvss_v3_base: Optional[Decimal] = Field(None, decimal_places=2, max_digits=5)
    risk_factor: Optional[str] = Field(None, max_length=50)
    epss: Optional[Decimal] = Field(None, decimal_places=2, max_digits=5)
    description: Optional[str] = None
    remediation: Optional[str] = None
    reference: Optional[str] = None
    solution: Optional[str] = None
    source: Optional[str] = Field(None, max_length=50)

class VulnerabilityCreate(VulnerabilityBase):
    """Model for creating a new vulnerability"""
    pass

class VulnerabilityUpdate(BaseModel):
    """Model for updating a vulnerability"""
    vuln_identifier: Optional[str] = Field(None, max_length=255)
    name: Optional[str] = Field(None, max_length=255)
    cve: Optional[str] = Field(None, max_length=50)
    cwe: Optional[str] = Field(None, max_length=50)
    owasp: Optional[str] = Field(None, max_length=255)
    severity: Optional[str] = Field(None, max_length=50)
    cvss_v3_base: Optional[Decimal] = Field(None, decimal_places=2, max_digits=5)
    risk_factor: Optional[str] = Field(None, max_length=50)
    epss: Optional[Decimal] = Field(None, decimal_places=2, max_digits=5)
    description: Optional[str] = None
    remediation: Optional[str] = None
    reference: Optional[str] = None
    solution: Optional[str] = None
    source: Optional[str] = Field(None, max_length=50)

class VulnerabilityResponse(VulnerabilityBase):
    """Model for vulnerability response"""
    class Config:
        from_attributes = True

# --- Asset Vulnerability Junction Models ---
class AssetVulnerabilityBase(BaseModel):
    """Base asset vulnerability junction model"""
    id: Optional[int] = None
    asset_id: Optional[int] = None
    vuln_id: Optional[int] = None
    status: Optional[str] = Field(None, max_length=50)
    first_seen: Optional[datetime] = None
    last_seen: Optional[datetime] = None
    evidence: Optional[str] = None
    plugin_output: Optional[str] = None
    code_snippet: Optional[str] = None
    context_repo: Optional[str] = Field(None, max_length=255)
    context_project: Optional[str] = Field(None, max_length=255)
    context_file_path: Optional[str] = Field(None, max_length=255)
    context_line: Optional[str] = Field(None, max_length=255)
    context_url: Optional[str] = Field(None, max_length=255)
    tool_vuln_id: Optional[str] = Field(None, max_length=255)

class AssetVulnerabilityCreate(AssetVulnerabilityBase):
    """Model for creating asset vulnerability relationship"""
    asset_id: int = Field(..., description="Asset ID is required")
    vuln_id: int = Field(..., description="Vulnerability ID is required")

class AssetVulnerabilityUpdate(BaseModel):
    """Model for updating asset vulnerability relationship"""
    status: Optional[str] = Field(None, max_length=50)
    first_seen: Optional[datetime] = None
    last_seen: Optional[datetime] = None
    evidence: Optional[str] = None
    plugin_output: Optional[str] = None
    code_snippet: Optional[str] = None
    context_repo: Optional[str] = Field(None, max_length=255)
    context_project: Optional[str] = Field(None, max_length=255)
    context_file_path: Optional[str] = Field(None, max_length=255)
    context_line: Optional[str] = Field(None, max_length=255)
    context_url: Optional[str] = Field(None, max_length=255)
    tool_vuln_id: Optional[str] = Field(None, max_length=255)

class AssetVulnerabilityResponse(AssetVulnerabilityBase):
    """Model for asset vulnerability response"""
    class Config:
        from_attributes = True

# --- Asset Models ---
class AssetBase(BaseModel):
    """Base asset model matching the actual database schema"""
    id: Optional[int] = None
    external_id: str = Field(..., max_length=255)  # Required field
    source: str = Field(..., max_length=50)        # Required field
    asset_name: Optional[str] = Field(None, max_length=255)
    fqdn: Optional[str] = Field(None, max_length=255)
    ip_address: Optional[str] = Field(None, max_length=50)
    asset_type: Optional[str] = Field(None, max_length=100)
    environment: Optional[str] = Field(None, max_length=100)
    owner: Optional[str] = Field(None, max_length=255)
    criticality: Optional[str] = Field(None, max_length=50)
    region_or_site: Optional[str] = Field(None, max_length=100)
    tags: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Computed fields from vulnerability counts
    total_vulns: Optional[int] = None
    critical_vulns: Optional[int] = None
    high_vulns: Optional[int] = None
    medium_vulns: Optional[int] = None
    low_vulns: Optional[int] = None

class AssetCreate(AssetBase):
    """Model for creating a new asset"""
    external_id: str = Field(..., description="External ID is required")
    source: str = Field(..., description="Source is required")

class AssetUpdate(BaseModel):
    """Model for updating an asset"""
    asset_name: Optional[str] = Field(None, max_length=255)
    fqdn: Optional[str] = Field(None, max_length=255)
    ip_address: Optional[str] = Field(None, max_length=50)
    asset_type: Optional[str] = Field(None, max_length=100)
    environment: Optional[str] = Field(None, max_length=100)
    owner: Optional[str] = Field(None, max_length=255)
    criticality: Optional[str] = Field(None, max_length=50)
    region_or_site: Optional[str] = Field(None, max_length=100)
    tags: Optional[str] = None

class AssetResponse(AssetBase):
    """Model for asset response"""
    class Config:
        from_attributes = True

# --- Dashboard Models ---
class VulnerabilitySummaryResponse(BaseModel):
    """Model for vulnerability summary response"""
    data: dict

class AssetVulnerabilitySummary(BaseModel):
    """Model for asset vulnerability summary"""
    asset_types: List[dict]
    environments: List[dict]
    top_vulnerable_assets: List[dict]

class VulnerabilityTrends(BaseModel):
    """Model for vulnerability trends"""
    monthly_trends: List[dict]
    source_breakdown: List[dict]

class DashboardSummary(BaseModel):
    """Model for dashboard summary"""
    totalAssets: int
    totalThreats: int
    riskScore: int
    vulnerabilities: dict

# --- API Response Models ---
class ApiResponse(BaseModel):
    """Generic API response model"""
    data: dict | list
    message: Optional[str] = None

class PaginatedResponse(BaseModel):
    """Paginated response model"""
    data: List[dict]
    pagination: dict
