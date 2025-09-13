from fastapi import APIRouter, Query
from sqlalchemy import text
from typing import Optional
from db import SessionLocal

router = APIRouter(prefix="/api", tags=["support"])


def _has_column(db, table: str, column: str) -> bool:
    return db.execute(text(
        """
        SELECT 1 FROM information_schema.columns
        WHERE table_name = :t AND column_name = :c LIMIT 1
        """
    ), {"t": table, "c": column}).scalar() is not None


@router.get("/debug-support")
def debug_support():
    """Debug endpoint to check database tables and structure."""
    with SessionLocal() as db:
        # Get all tables
        all_tables = db.execute(text(
            """
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = CURRENT_SCHEMA()
            ORDER BY table_name;
            """
        )).fetchall()
        
        # Check for support-related tables
        support_tables = db.execute(text(
            """
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = CURRENT_SCHEMA() AND table_name ILIKE '%support%';
            """
        )).fetchall()
        
        # Check for ticket-related tables
        ticket_tables = db.execute(text(
            """
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = CURRENT_SCHEMA() AND table_name ILIKE '%ticket%';
            """
        )).fetchall()
        
        # Check for knowledge-related tables
        knowledge_tables = db.execute(text(
            """
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = CURRENT_SCHEMA() AND table_name ILIKE '%knowledge%';
            """
        )).fetchall()
        
        # If SUPPORTTICKETS exists, get its structure and sample data
        support_structure = None
        sample_data = None
        if any('SUPPORTTICKETS' in t[0].upper() for t in support_tables):
            support_structure = db.execute(text(
                """
                SELECT column_name, data_type FROM information_schema.columns
                WHERE table_name ILIKE 'SUPPORTTICKETS' AND table_schema = CURRENT_SCHEMA()
                ORDER BY ordinal_position;
                """
            )).fetchall()
            
            # Get sample data to see actual values
            sample_data = db.execute(text(
                """
                SELECT * FROM SUPPORTTICKETS LIMIT 3;
                """
            )).mappings().all()
        
        return {
            "all_tables": [t[0] for t in all_tables],
            "support_tables": [t[0] for t in support_tables],
            "ticket_tables": [t[0] for t in ticket_tables],
            "knowledge_tables": [t[0] for t in knowledge_tables],
            "support_structure": support_structure,
            "sample_data": [dict(row) for row in sample_data] if sample_data else None
        }


@router.get("/support-summary")
def get_support_summary():
    """Get support tickets summary statistics."""
    with SessionLocal() as db:
        # Check for SUPPORTTICKETS table with case-insensitive search
        table_exists = db.execute(text(
            """
            SELECT 1 FROM information_schema.tables
            WHERE LOWER(table_name) = LOWER('SUPPORTTICKETS') AND table_schema = CURRENT_SCHEMA();
            """
        )).scalar()
        
        print(f"🔍 Looking for SUPPORTTICKETS table: {table_exists}")
        
        if not table_exists:
            # Let's also check what tables exist
            all_tables = db.execute(text(
                """
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = CURRENT_SCHEMA() AND table_name ILIKE '%support%';
                """
            )).fetchall()
            print(f"📋 Available support-related tables: {[t[0] for t in all_tables]}")
            return {"data": {"total": 0, "open": 0, "inProgress": 0, "resolved": 0}}

        # Try different possible table names
        table_name = "SUPPORTTICKETS"
        
        total = db.execute(text(f"SELECT COUNT(*) FROM {table_name}")).scalar() or 0
        print(f"📊 Total tickets found: {total}")
        
        # Get all unique status values to see what we're working with
        status_values = db.execute(text(
            f"SELECT DISTINCT status FROM {table_name} WHERE status IS NOT NULL"
        )).fetchall()
        print(f"🔍 Found status values: {[s[0] for s in status_values]}")
        
        open_count = 0
        in_progress_count = 0
        resolved_count = 0
        
        # Use exact case-sensitive values from your database
        open_count = db.execute(text(
            f"SELECT COUNT(*) FROM {table_name} WHERE status = 'Open'"
        )).scalar() or 0
        
        in_progress_count = db.execute(text(
            f"SELECT COUNT(*) FROM {table_name} WHERE status = 'In Progress'"
        )).scalar() or 0
        
        resolved_count = db.execute(text(
            f"SELECT COUNT(*) FROM {table_name} WHERE status = 'Resolved'"
        )).scalar() or 0

        print(f"📈 Status breakdown: Open={open_count}, InProgress={in_progress_count}, Resolved={resolved_count}")

        return {"data": {
            "total": total,
            "open": open_count,
            "inProgress": in_progress_count,
            "resolved": resolved_count
        }}


@router.get("/support-tickets")
def get_support_tickets(
    search: Optional[str] = Query(None, description="Search by title or description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    status: Optional[str] = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    """Get support tickets with search and filtering."""
    with SessionLocal() as db:
        # Check if SUPPORTTICKETS table exists (your existing table)
        table_exists = db.execute(text(
            """
            SELECT 1 FROM information_schema.tables
            WHERE LOWER(table_name) = LOWER('SUPPORTTICKETS') AND table_schema = CURRENT_SCHEMA();
            """
        )).scalar()
        
        if not table_exists:
            return {"data": [], "pagination": {"total": 0, "page": page, "limit": limit, "totalPages": 0}}

        table_name = "SUPPORTTICKETS"

        # Use direct query with known column names
        base_query = f"""
            SELECT ticketid, title, description, priority, status, category, 
                   assignedto, createdby, createddate, lastupdated
            FROM {table_name} WHERE 1=1
        """
        params = {}
        conditions = []

        if search:
            conditions.append("(title ILIKE :search OR description ILIKE :search)")
            params["search"] = f"%{search}%"

        if category and category != "all":
            conditions.append("category = :category")
            params["category"] = category

        if priority and priority != "all":
            conditions.append("priority = :priority")
            params["priority"] = priority

        if status and status != "all":
            conditions.append("status = :status")
            params["status"] = status

        if conditions:
            base_query += " AND " + " AND ".join(conditions)

        base_query += " ORDER BY createddate DESC"
        
        # Get total count for pagination
        count_query = f"SELECT COUNT(*) FROM {table_name} WHERE 1=1"
        if conditions:
            count_query += " AND " + " AND ".join(conditions)
        total = db.execute(text(count_query), params).scalar() or 0

        # Add pagination
        offset = (page - 1) * limit
        paginated_query = f"{base_query} LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset

        rows = db.execute(text(paginated_query), params).mappings().all()

        # Map backend fields to frontend expectations
        formatted_rows = []
        for row in rows:
            row_dict = dict(row)
            print(f"🔍 Raw row data: {row_dict}")  # Debug print
            
            # Handle date conversion properly
            created_date = row_dict.get("createddate")
            if created_date:
                try:
                    created_date_str = created_date.isoformat() if hasattr(created_date, 'isoformat') else str(created_date)
                except:
                    created_date_str = str(created_date)
            else:
                created_date_str = ""
                
            updated_date = row_dict.get("lastupdated")
            if updated_date:
                try:
                    updated_date_str = updated_date.isoformat() if hasattr(updated_date, 'isoformat') else str(updated_date)
                except:
                    updated_date_str = str(updated_date)
            else:
                updated_date_str = ""
            
            formatted_row = {
                "_id": str(row_dict.get("ticketid")),
                "title": row_dict.get("title", "N/A"),
                "description": row_dict.get("description", "No description provided."),
                "priority": row_dict.get("priority", "Medium"),
                "status": row_dict.get("status", "Open"),
                "category": row_dict.get("category", "General"),
                "assignedTo": f"User {row_dict.get('assignedto', 'Unassigned')}" if row_dict.get('assignedto') else "Unassigned",
                "createdAt": created_date_str,
                "updatedAt": updated_date_str,
                "responseTime": "N/A"  # Not in your table structure
            }
            formatted_rows.append(formatted_row)

        return {
            "data": formatted_rows,
            "pagination": {
                "total": total,
                "page": page,
                "limit": limit,
                "totalPages": (total + limit - 1) // limit
            }
        }


@router.get("/knowledge-articles")
def get_knowledge_articles(
    search: Optional[str] = Query(None, description="Search by title"),
    category: Optional[str] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    """Get knowledge articles with search and filtering."""
    with SessionLocal() as db:
        # Check if KnowledgeBaseArticles table exists (your existing table)
        table_exists = db.execute(text(
            """
            SELECT 1 FROM information_schema.tables
            WHERE LOWER(table_name) = LOWER('KnowledgeBaseArticles') AND table_schema = CURRENT_SCHEMA();
            """
        )).scalar()
        
        if not table_exists:
            return {"data": [], "pagination": {"total": 0, "page": page, "limit": limit, "totalPages": 0}}

        table_name = "KnowledgeBaseArticles"

        # Use direct query with exact column names from your database
        base_query = f"""
            SELECT articleid, title, category, views, tags, createdat, lastupdated
            FROM {table_name} WHERE 1=1
        """
        params = {}
        conditions = []

        if search:
            conditions.append("title ILIKE :search")
            params["search"] = f"%{search}%"

        if category and category != "all":
            conditions.append("category = :category")
            params["category"] = category

        if conditions:
            base_query += " AND " + " AND ".join(conditions)

        base_query += " ORDER BY views DESC"
        
        # Get total count for pagination
        count_query = f"SELECT COUNT(*) FROM {table_name} WHERE 1=1"
        if conditions:
            count_query += " AND " + " AND ".join(conditions)
        total = db.execute(text(count_query), params).scalar() or 0

        # Add pagination
        offset = (page - 1) * limit
        paginated_query = f"{base_query} LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset

        rows = db.execute(text(paginated_query), params).mappings().all()

        # Map backend fields to frontend expectations
        formatted_rows = []
        for row in rows:
            row_dict = dict(row)
            
            # Parse tags from text to array
            tags_text = row_dict.get("tags", "")
            tags = []
            if tags_text:
                try:
                    # Split by comma and clean up
                    tags = [tag.strip() for tag in tags_text.split(",") if tag.strip()]
                except:
                    tags = []
            
            # Handle date conversion
            last_updated = row_dict.get("lastupdated")
            if last_updated:
                try:
                    last_updated_str = last_updated.isoformat() if hasattr(last_updated, 'isoformat') else str(last_updated)
                except:
                    last_updated_str = str(last_updated)
            else:
                last_updated_str = ""
            
            formatted_row = {
                "_id": str(row_dict.get("articleid")),
                "title": row_dict.get("title", "N/A"),
                "category": row_dict.get("category", "General"),
                "tags": tags,
                "lastUpdated": last_updated_str,
                "views": row_dict.get("views", 0),
                "helpful": 0  # Not in your table structure
            }
            formatted_rows.append(formatted_row)

        return {
            "data": formatted_rows,
            "pagination": {
                "total": total,
                "page": page,
                "limit": limit,
                "totalPages": (total + limit - 1) // limit
            }
        }


@router.get("/support-channels")
def get_support_channels():
    """Get available support channels."""
    # This is static data since it doesn't change often
    channels = [
        {
            "name": "Email Support",
            "icon": "Mail",
            "description": "Get help via email",
            "response": "4 hours",
            "available": True
        },
        {
            "name": "Phone Support", 
            "icon": "Phone",
            "description": "Speak with our experts",
            "response": "Immediate",
            "available": True
        },
        {
            "name": "Live Chat",
            "icon": "MessageCircle", 
            "description": "Real-time chat support",
            "response": "2 minutes",
            "available": True
        },
        {
            "name": "Knowledge Base",
            "icon": "BookOpen",
            "description": "Self-service articles", 
            "response": "Instant",
            "available": True
        }
    ]
    
    return {"data": channels}
