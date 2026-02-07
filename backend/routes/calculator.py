from fastapi import APIRouter
from schemas.calculator import EMIRequest, EMIResponse, EligibilityRequest, EligibilityResponse

router = APIRouter(prefix="/api/calculator", tags=["Calculator"])

@router.post("/emi", response_model=EMIResponse)
async def calculate_emi(data: EMIRequest):
    """Calculate EMI for given parameters"""

    # Convert property price to actual amount (Lakhs to Rupees)
    property_price_inr = data.property_price * 100000

    # Calculate loan amount after down payment
    down_payment_amount = property_price_inr * (data.down_payment / 100)
    loan_amount = property_price_inr - down_payment_amount

    # Calculate monthly interest rate
    monthly_rate = data.interest_rate / 12 / 100

    # Number of monthly payments
    num_months = data.loan_tenure * 12

    # EMI Calculation using formula:
    # EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    if monthly_rate == 0:
        monthly_emi = loan_amount / num_months
        total_payable = loan_amount
        total_interest = 0
    else:
        monthly_emi = (
            loan_amount * monthly_rate * pow(1 + monthly_rate, num_months)
        ) / (pow(1 + monthly_rate, num_months) - 1)

        total_payable = monthly_emi * num_months
        total_interest = total_payable - loan_amount

    # Calculate percentages
    principal_percentage = (loan_amount / total_payable) * 100 if total_payable > 0 else 100
    interest_percentage = (total_interest / total_payable) * 100 if total_payable > 0 else 0

    return EMIResponse(
        monthly_emi=round(monthly_emi, 2),
        loan_amount=round(loan_amount, 2),
        total_interest=round(total_interest, 2),
        total_payable=round(total_payable, 2),
        principal_percentage=round(principal_percentage, 2),
        interest_percentage=round(interest_percentage, 2)
    )

@router.post("/eligibility", response_model=EligibilityResponse)
async def check_eligibility(data: EligibilityRequest):
    """Calculate loan eligibility based on income"""

    # Banks typically allow EMI up to 40-50% of monthly income
    # We'll use 45% as a safe estimate
    max_emi_ratio = 0.45

    # Calculate maximum affordable EMI
    available_income = data.monthly_income - data.existing_emi
    max_emi_affordable = available_income * max_emi_ratio

    # Calculate maximum loan amount for given tenure and interest rate
    monthly_rate = data.interest_rate / 12 / 100
    num_months = data.loan_tenure * 12

    if monthly_rate == 0:
        max_loan_amount = max_emi_affordable * num_months
    else:
        # Reverse EMI formula to get Principal
        # P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
        max_loan_amount = (
            max_emi_affordable * (pow(1 + monthly_rate, num_months) - 1)
        ) / (monthly_rate * pow(1 + monthly_rate, num_months))

    # Assuming 20% down payment, calculate max property price
    down_payment_percent = 20
    max_property_price = max_loan_amount / (1 - down_payment_percent / 100)
    down_payment_required = max_property_price - max_loan_amount

    return EligibilityResponse(
        max_emi_affordable=round(max_emi_affordable, 2),
        max_loan_amount=round(max_loan_amount, 2),
        max_property_price=round(max_property_price, 2),
        down_payment_required=round(down_payment_required, 2)
    )
