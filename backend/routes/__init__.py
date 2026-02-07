from .auth import router as auth_router
from .properties import router as properties_router
from .enquiries import router as enquiries_router
from .price_index import router as price_index_router
from .area_guide import router as area_guide_router
from .calculator import router as calculator_router
from .site_settings import router as site_settings_router
from .features import router as features_router
from .stats import router as stats_router
from .testimonials import router as testimonials_router
from .benefits import router as benefits_router

__all__ = [
    "auth_router",
    "properties_router",
    "enquiries_router",
    "price_index_router",
    "area_guide_router",
    "calculator_router",
    "site_settings_router",
    "features_router",
    "stats_router",
    "testimonials_router",
    "benefits_router"
]
