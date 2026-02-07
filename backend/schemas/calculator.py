from pydantic import BaseModel
from typing import Optional

class EMIRequest(BaseModel):
    property_price: float  # in Lakhs
    down_payment: float  # percentage (e.g., 20 for 20%)
    interest_rate: float  # annual rate percentage (e.g., 8.5)
    loan_tenure: int  # in years

class EMIResponse(BaseModel):
    monthly_emi: float
    loan_amount: float
    total_interest: float
    total_payable: float
    principal_percentage: float
    interest_percentage: float

class EligibilityRequest(BaseModel):
    monthly_income: float
    existing_emi: float = 0
    loan_tenure: int = 20
    interest_rate: float = 8.5

class EligibilityResponse(BaseModel):
    max_emi_affordable: float
    max_loan_amount: float
    max_property_price: float
    down_payment_required: float
