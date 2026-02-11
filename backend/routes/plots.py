import math
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from database import get_db
from models.plot import plot_to_camelcase

router = APIRouter(prefix="/api", tags=["Plots"])


@router.get("/plots")
async def get_plots(
    type: Optional[str] = Query(None, description="Filter by type: Residential, Commercial, Farm House"),
    search: Optional[str] = Query(None, description="Search in title and location"),
    sort: Optional[str] = Query("newest", description="Sort: newest, price_low, price_high"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    featured: Optional[bool] = Query(None, description="Filter featured plots only"),
    min_price: Optional[int] = Query(None, description="Min price per decimal"),
    max_price: Optional[int] = Query(None, description="Max price per decimal"),
):
    """Get plots with filtering, sorting, search, and pagination."""
    db = get_db()

    # Build query filter
    query = {"is_active": True}

    if featured is not None:
        query["is_featured"] = featured

    if type:
        query["type"] = type

    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
        ]

    if min_price is not None:
        query["price_per_decimal.max"] = {"$gte": min_price}

    if max_price is not None:
        query.setdefault("price_per_decimal.min", {})
        if isinstance(query.get("price_per_decimal.min"), dict):
            query["price_per_decimal.min"]["$lte"] = max_price
        else:
            query["price_per_decimal.min"] = {"$lte": max_price}

    # Sort
    sort_key = [("created_at", -1)]  # default: newest
    if sort == "price_low":
        sort_key = [("price_per_decimal.min", 1)]
    elif sort == "price_high":
        sort_key = [("price_per_decimal.max", -1)]

    # Count total
    total = await db.plots.count_documents(query)
    total_pages = math.ceil(total / limit) if total > 0 else 1

    # Fetch paginated
    skip = (page - 1) * limit
    cursor = db.plots.find(query).sort(sort_key).skip(skip).limit(limit)
    plots = await cursor.to_list(length=limit)

    return {
        "plots": [plot_to_camelcase(p) for p in plots],
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": total_pages,
    }


@router.get("/plots/{slug}")
async def get_plot_by_slug(slug: str):
    """Get a single plot by slug (camelCase response)."""
    db = get_db()
    plot = await db.plots.find_one({"slug": slug, "is_active": True})
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return plot_to_camelcase(plot)
