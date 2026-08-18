"""
sensitivity_recalculator.py — What-If Sensitivity Engine
=========================================================
Project: AGRI-DECIDE (PS #24)
Component: What-If Recalculation for Frontend Sliders

Recomputes expected yield, gross revenue, costs, and net profit when a user
adjusts scenario parameters:
  • Sowing delay change (+N days)
  • Rainfall deficit (e.g. -20%)
  • Mandi price shock (e.g. -10%)

Uses CACP cultivation costs from CSV (with hardcoded fallback) to compute
full economic projections per acre.
"""

import os
import pandas as pd
from typing import Dict, Optional

# ──────────────────────────────────────────────────────────────
# Fallback CACP Costs (₹ per acre) — Pune/Baramati benchmarks
# ──────────────────────────────────────────────────────────────
FALLBACK_CACP_COSTS: Dict[str, float] = {
    "MAIZE": 19200.0,
    "JOWAR": 13200.0,
    "BAJRA": 11000.0,
    "WHEAT": 17000.0,
    "TUR": 15200.0,
    "MOONG": 12000.0,
    "URAD": 12500.0,
    "GRAM": 14000.0,
    "SOYBEAN": 16000.0,
    "COTTON": 24000.0,
    "GROUNDNUT": 19500.0,
    "SUNFLOWER": 15000.0,
    "SUGARCANE": 50000.0,
    "ONION": 38000.0,
    "TOMATO": 44000.0,
}


class SensitivityRecalculator:
    """
    What-If sensitivity engine for AGRI-DECIDE.
    
    Applies scenario adjustments to base yield and price predictions,
    then computes full economic projections including revenue, costs,
    and net profit per acre.
    """

    def __init__(self, cacp_path: Optional[str] = None):
        if cacp_path is None:
            project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            for candidate in [
                os.path.join(project_dir, "data", "official_real_data", "cacp_itemized_costs_pune.csv"),
                os.path.join(project_dir, "data", "official_real_data", "cacp_costs_official_maharashtra.csv"),
                os.path.join(project_dir, "data", "cacp_costs_pune.csv"),
            ]:
                if os.path.exists(candidate):
                    cacp_path = candidate
                    break
        self.cacp_path = cacp_path or ""
        self.costs: Dict[str, float] = {}
        self._load_costs()

    def _load_costs(self):
        """Load CACP cost data from CSV or use fallback."""
        if os.path.exists(self.cacp_path):
            try:
                df = pd.read_csv(self.cacp_path)
                self.costs = dict(zip(df['crop_id'], df['total_cost_per_acre']))
                print(f"[SensitivityRecalculator] Loaded CACP costs for {len(self.costs)} crops from CSV.")
                return
            except Exception as e:
                print(f"[SensitivityRecalculator] Warning: CSV load failed ({e}). Using fallback costs.")

        print("[SensitivityRecalculator] Using hardcoded fallback CACP costs.")
        self.costs = FALLBACK_CACP_COSTS.copy()

    def recalculate_whatif(
        self,
        crop_id: str,
        base_yield: float,
        base_harvest_price: float,
        sowing_delay_change: int = 0,
        rainfall_deficit_pct: float = 0.0,
        mandi_price_shock_pct: float = 0.0,
    ) -> dict:
        """
        Recalculates yield, revenue, costs and profit under a What-If scenario.

        Args:
            crop_id: Crop identifier (e.g. 'SOYBEAN')
            base_yield: Predicted yield in qtl/acre (from yield_predictor)
            base_harvest_price: Expected mandi price in ₹/qtl (from price_forecaster)
            sowing_delay_change: Additional days of sowing delay (+N days)
            rainfall_deficit_pct: Rainfall deficit as a percentage (e.g. -20.0 for 20% deficit)
            mandi_price_shock_pct: Price shock as percentage (e.g. -10.0 for 10% crash)

        Returns:
            dict with adjusted yield, price, revenue, cost, profit, and summary.
        """
        crop_id = crop_id.upper()

        # ─── Yield adjustments (multiplicative) ───
        # Sowing delay penalty: 1.5% yield loss per day of extra delay (clamped at 50% max loss)
        delay_factor = max(0.5, 1.0 - sowing_delay_change * 0.015)

        # Rainfall deficit impact on yield
        rainfall_factor = 1.0 + (rainfall_deficit_pct / 100.0)
        rainfall_factor = max(0.3, rainfall_factor)  # clamp to prevent >70% loss

        adjusted_yield = max(0.0, base_yield * delay_factor * rainfall_factor)
        adjusted_yield = round(adjusted_yield, 2)

        # ─── Price adjustment ───
        price_factor = 1.0 + (mandi_price_shock_pct / 100.0)
        price_factor = max(0.1, price_factor)  # clamp to prevent >90% crash
        adjusted_price = round(base_harvest_price * price_factor, 2)

        # ─── Economic projections ───
        gross_revenue = round(adjusted_yield * adjusted_price, 2)

        total_cost = self.costs.get(crop_id, 15000.0)  # fallback cost if unknown crop
        net_profit = round(gross_revenue - total_cost, 2)

        profit_margin = round((net_profit / gross_revenue) * 100, 2) if gross_revenue > 0 else -100.0

        # ─── Change percentages ───
        yield_change_pct = round(((adjusted_yield - base_yield) / base_yield) * 100, 2) if base_yield > 0 else 0.0
        price_change_pct = round(((adjusted_price - base_harvest_price) / base_harvest_price) * 100, 2) if base_harvest_price > 0 else 0.0

        # ─── Human-readable summary ───
        adjustments = []
        if sowing_delay_change != 0:
            adjustments.append(f"sowing delay +{sowing_delay_change} days")
        if rainfall_deficit_pct != 0:
            adjustments.append(f"rainfall {rainfall_deficit_pct:+.0f}%")
        if mandi_price_shock_pct != 0:
            adjustments.append(f"price shock {mandi_price_shock_pct:+.0f}%")

        scenario_desc = ", ".join(adjustments) if adjustments else "No changes"
        profit_status = "PROFIT" if net_profit > 0 else "LOSS"

        summary = (
            f"{crop_id} under [{scenario_desc}]: "
            f"Yield {adjusted_yield} qtl/acre ({yield_change_pct:+.1f}%), "
            f"Price ₹{adjusted_price:,.0f}/qtl ({price_change_pct:+.1f}%), "
            f"Net {profit_status} ₹{abs(net_profit):,.0f}/acre"
        )

        return {
            "crop_id": crop_id,
            "base_yield": base_yield,
            "adjusted_yield": adjusted_yield,
            "yield_change_pct": yield_change_pct,
            "base_price": base_harvest_price,
            "adjusted_price": adjusted_price,
            "price_change_pct": price_change_pct,
            "gross_revenue_per_acre": gross_revenue,
            "total_cost_per_acre": total_cost,
            "net_profit_per_acre": net_profit,
            "profit_margin_pct": profit_margin,
            "scenario_summary": summary,
        }


# ──────────────────────────────────────────────────────────────
# Module-level convenience function
# ──────────────────────────────────────────────────────────────
_recalculator: Optional[SensitivityRecalculator] = None


def recalculate_whatif(
    crop_id: str,
    base_yield: float,
    base_harvest_price: float,
    sowing_delay_change: int = 0,
    rainfall_deficit_pct: float = 0.0,
    mandi_price_shock_pct: float = 0.0,
) -> dict:
    """Module-level convenience wrapper."""
    global _recalculator
    if _recalculator is None:
        _recalculator = SensitivityRecalculator()
    return _recalculator.recalculate_whatif(
        crop_id, base_yield, base_harvest_price,
        sowing_delay_change, rainfall_deficit_pct, mandi_price_shock_pct,
    )


# ──────────────────────────────────────────────────────────────
# Demo / Self-Test
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 70)
    print("  AGRI-DECIDE — What-If Sensitivity Recalculator Demo")
    print("=" * 70)

    engine = SensitivityRecalculator()

    # Scenario 1: SOYBEAN with +15 day sowing delay
    print("\n─── Scenario 1: SOYBEAN — Sowing Delay +15 days ───")
    r1 = engine.recalculate_whatif(
        crop_id="SOYBEAN", base_yield=9.5, base_harvest_price=4784.0,
        sowing_delay_change=15
    )
    print(f"  {r1['scenario_summary']}")
    print(f"  Gross Revenue: ₹{r1['gross_revenue_per_acre']:,.0f}  |  "
          f"Cost: ₹{r1['total_cost_per_acre']:,.0f}  |  "
          f"Net Profit: ₹{r1['net_profit_per_acre']:,.0f}")
    print(f"  Profit Margin: {r1['profit_margin_pct']:.1f}%")

    # Scenario 2: COTTON with -20% rainfall deficit
    print("\n─── Scenario 2: COTTON — Rainfall Deficit -20% ───")
    r2 = engine.recalculate_whatif(
        crop_id="COTTON", base_yield=7.8, base_harvest_price=5796.0,
        rainfall_deficit_pct=-20.0
    )
    print(f"  {r2['scenario_summary']}")
    print(f"  Gross Revenue: ₹{r2['gross_revenue_per_acre']:,.0f}  |  "
          f"Cost: ₹{r2['total_cost_per_acre']:,.0f}  |  "
          f"Net Profit: ₹{r2['net_profit_per_acre']:,.0f}")
    print(f"  Profit Margin: {r2['profit_margin_pct']:.1f}%")

    # Scenario 3: MAIZE with -10% price shock
    print("\n─── Scenario 3: MAIZE — Mandi Price Shock -10% ───")
    r3 = engine.recalculate_whatif(
        crop_id="MAIZE", base_yield=24.0, base_harvest_price=1890.0,
        mandi_price_shock_pct=-10.0
    )
    print(f"  {r3['scenario_summary']}")
    print(f"  Gross Revenue: ₹{r3['gross_revenue_per_acre']:,.0f}  |  "
          f"Cost: ₹{r3['total_cost_per_acre']:,.0f}  |  "
          f"Net Profit: ₹{r3['net_profit_per_acre']:,.0f}")
    print(f"  Profit Margin: {r3['profit_margin_pct']:.1f}%")

    print("\n" + "=" * 70)
