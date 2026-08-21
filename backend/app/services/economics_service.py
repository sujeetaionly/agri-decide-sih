"""
Economics Service:
Implements CACP cultivation cost adjustments for farmer-owned machinery
and computes Gross Revenue, Net Profit per Acre, and Net Profit per Day.
"""
from typing import List, Optional

TRACTOR_OWNERSHIP_DEDUCTION = 3500.0  # ₹3,500 savings if farmer owns tractor/rotavator
SPRAYER_OWNERSHIP_DEDUCTION = 800.0   # ₹800 savings if farmer owns sprayer pump
PUMP_OWNERSHIP_DEDUCTION = 600.0      # ₹600 savings if farmer owns water pump / motor
HARVESTER_OWNERSHIP_DEDUCTION = 1500.0 # ₹1,500 savings if farmer owns thresher / harvester

def calculate_adjusted_cost(
    base_cacp_total_cost: float,
    owns_tractor: bool = False,
    owns_sprayer: bool = False,
    owns_pump: bool = False,
    owns_harvester: bool = False,
    equipments: Optional[List[str]] = None
) -> float:
    """
    Computes adjusted cultivation cost per acre based on farmer-owned machinery and equipment.
    """
    if equipments:
        eq_upper = [e.upper() for e in equipments]
        if "TRACTOR" in eq_upper:
            owns_tractor = True
        if "SPRAYER" in eq_upper:
            owns_sprayer = True
        if "PUMP" in eq_upper:
            owns_pump = True
        if "HARVESTER" in eq_upper:
            owns_harvester = True

    adjusted = base_cacp_total_cost
    if owns_tractor:
        adjusted -= TRACTOR_OWNERSHIP_DEDUCTION
    if owns_sprayer:
        adjusted -= SPRAYER_OWNERSHIP_DEDUCTION
    if owns_pump:
        adjusted -= PUMP_OWNERSHIP_DEDUCTION
    if owns_harvester:
        adjusted -= HARVESTER_OWNERSHIP_DEDUCTION
    # Guarantee minimum realistic baseline cost
    return max(4000.0, round(adjusted, 2))

def calculate_gross_revenue(predicted_yield_qtl: float, mandi_price_per_qtl: float) -> float:
    """
    Gross Revenue per Acre = Predicted Yield (qtl/acre) * Mandi Price (₹/qtl)
    """
    return round(predicted_yield_qtl * mandi_price_per_qtl, 2)

def calculate_net_profit(gross_revenue: float, adjusted_cost: float) -> float:
    """
    Net Profit per Acre = Gross Revenue - Adjusted Cultivation Cost
    """
    return round(gross_revenue - adjusted_cost, 2)

def calculate_net_profit_per_day(net_profit_per_acre: float, duration_days: int) -> float:
    """
    Net Profit per Day = Net Profit per Acre / Duration Days
    """
    if duration_days <= 0:
        duration_days = 90
    return round(net_profit_per_acre / duration_days, 2)
