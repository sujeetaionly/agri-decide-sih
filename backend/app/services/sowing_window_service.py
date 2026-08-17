"""
Sowing Window Service:
Evaluates farmer's planned sowing date against ICAR agro-climatic district sowing windows.
Computes delay days and assigns optimal/moderate/late status and UI badge.
"""
from datetime import datetime
from typing import Dict, Any, Tuple

def parse_date_month_day(date_str: str) -> Tuple[int, int]:
    """
    Parses a date string in 'YYYY-MM-DD' or 'MM-DD' format into (month, day).
    """
    try:
        if len(date_str) == 10 and date_str[4] == '-':
            dt = datetime.strptime(date_str, "%Y-%m-%d")
            return dt.month, dt.day
        elif len(date_str) == 5 and date_str[2] == '-':
            dt = datetime.strptime(date_str, "%m-%d")
            return dt.month, dt.day
    except Exception:
        pass
    # Default to mid June if parsing fails
    return 6, 20

def evaluate_sowing_window(
    planned_sowing_date_str: str,
    optimal_start_str: str = "06-15",
    optimal_end_str: str = "07-10",
    late_cutoff_str: str = "07-25"
) -> Dict[str, Any]:
    """
    Evaluates the planned sowing date against district optimal window.
    Returns status, badge text, badge color, and sowing delay days.
    """
    # Use standard reference year (2027) for comparison
    ref_year = 2027
    s_month, s_day = parse_date_month_day(planned_sowing_date_str)
    opt_start_m, opt_start_d = parse_date_month_day(optimal_start_str)
    opt_end_m, opt_end_d = parse_date_month_day(optimal_end_str)
    late_m, late_d = parse_date_month_day(late_cutoff_str)

    planned_dt = datetime(ref_year, s_month, s_day)
    opt_start_dt = datetime(ref_year, opt_start_m, opt_start_d)
    opt_end_dt = datetime(ref_year, opt_end_m, opt_end_d)
    late_dt = datetime(ref_year, late_m, late_d)

    if planned_dt < opt_start_dt:
        # Pre-monsoon / Early sowing
        diff_days = (opt_start_dt - planned_dt).days
        return {
            "status": "EARLY",
            "badge_text": f"पूर्व बुवाई / Pre-Monsoon ({opt_start_str} से अनुकूल)",
            "badge_color": "yellow",
            "sowing_delay_days": 0,
            "is_optimal": True
        }
    elif planned_dt <= opt_end_dt:
        # Optimal window
        return {
            "status": "OPTIMAL",
            "badge_text": f"अनुकूल बुवाई समय ({optimal_start_str} - {optimal_end_str})",
            "badge_color": "green",
            "sowing_delay_days": 0,
            "is_optimal": True
        }
    elif planned_dt <= late_dt:
        # Late window (yield penalty applies)
        delay_days = (planned_dt - opt_end_dt).days
        return {
            "status": "MODERATE",
            "badge_text": f"विलंबित बुवाई / Late Sowing (+{delay_days} दिन देरी)",
            "badge_color": "yellow",
            "sowing_delay_days": delay_days,
            "is_optimal": False
        }
    else:
        # Closed / Highly degraded window
        delay_days = (planned_dt - opt_end_dt).days
        return {
            "status": "LATE",
            "badge_text": f"अत्यधिक विलंब / Closed Window (+{delay_days} दिन)",
            "badge_color": "red",
            "sowing_delay_days": delay_days,
            "is_optimal": False
        }
