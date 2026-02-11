import re
from datetime import datetime, timezone
from typing import List, Optional, Union
from pydantic import BaseModel, Field


class NearbyPlace(BaseModel):
    type: str
    name: str
    distance: str


class PricePerDecimal(BaseModel):
    min: int
    max: int


class PlotModel(BaseModel):
    slug: str = ""
    title: str
    location: str
    type: str  # Residential | Commercial | Farm House
    highlight: str = ""
    size_range: str = ""

    price_per_decimal: PricePerDecimal

    sqft: int = 0
    decimal: float = 0
    dimensions: str = ""
    road_width: str = ""
    road_type: str = ""
    facing: str = ""
    corner_plot: bool = False
    boundary_wall: bool = False
    water: Union[bool, str] = True  # true | false | "Borewell"
    electricity: bool = True
    landmark: str = ""
    distance_main_road: str = ""
    status: str = "Ready for Construction"

    nearby: List[NearbyPlace] = []

    photos: List[str] = []
    video: Optional[str] = None
    video_type: Optional[str] = None

    is_active: bool = True
    is_featured: bool = False

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def generate_slug(self):
        text = f"{self.title} {self.location.split(',')[0]}"
        slug = re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')
        self.slug = slug
        return slug


class PlotCreate(BaseModel):
    title: str
    location: str
    type: str
    highlight: str = ""
    size_range: str = ""

    price_min: int = 0
    price_max: int = 0

    sqft: int = 0
    decimal: float = 0
    dimensions: str = ""
    road_width: str = ""
    road_type: str = ""
    facing: str = ""
    corner_plot: bool = False
    boundary_wall: bool = False
    water: str = "true"  # "true" | "false" | "Borewell" from form
    electricity: bool = True
    landmark: str = ""
    distance_main_road: str = ""
    status: str = "Ready for Construction"

    video: Optional[str] = None
    video_type: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False


class PlotUpdate(PlotCreate):
    pass


def plot_to_camelcase(plot: dict) -> dict:
    """Convert a MongoDB plot document to camelCase for frontend consumption."""
    return {
        "id": str(plot["_id"]),
        "slug": plot.get("slug", ""),
        "title": plot.get("title", ""),
        "location": plot.get("location", ""),
        "type": plot.get("type", ""),
        "highlight": plot.get("highlight", ""),
        "sizeRange": plot.get("size_range", ""),
        "pricePerDecimal": plot.get("price_per_decimal", {"min": 0, "max": 0}),
        "sqft": plot.get("sqft", 0),
        "decimal": plot.get("decimal", 0),
        "dimensions": plot.get("dimensions", ""),
        "roadWidth": plot.get("road_width", ""),
        "roadType": plot.get("road_type", ""),
        "facing": plot.get("facing", ""),
        "cornerPlot": plot.get("corner_plot", False),
        "boundaryWall": plot.get("boundary_wall", False),
        "water": plot.get("water", True),
        "electricity": plot.get("electricity", True),
        "landmark": plot.get("landmark", ""),
        "distanceMainRoad": plot.get("distance_main_road", ""),
        "status": plot.get("status", ""),
        "nearby": plot.get("nearby", []),
        "photos": plot.get("photos", []),
        "video": plot.get("video"),
        "videoType": plot.get("video_type"),
        "isFeatured": plot.get("is_featured", False),
    }
