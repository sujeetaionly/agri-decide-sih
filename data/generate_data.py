import os
import pandas as pd
import numpy as np

np.random.seed(42)

out_dir = r"D:\Coding\AGRI-DECIDE\data"
os.makedirs(out_dir, exist_ok=True)

# 1. cacp_costs_pune.csv
costs_data = [
    # crop_id, crop_name, seeds, fert, pest, labor, mach, irrig
    ['MAIZE', 'Maize', 1500, 4500, 2000, 6000, 3000, 2000],   # ~19k
    ['JOWAR', 'Jowar', 800, 3000, 1000, 5000, 2000, 1200],    # ~13k
    ['BAJRA', 'Bajra', 600, 2500, 800, 4500, 1500, 1100],     # ~11k
    ['WHEAT', 'Wheat', 1800, 4000, 1500, 5500, 2500, 1700],   # ~17k
    ['TUR', 'Tur', 1200, 3500, 2500, 4500, 2000, 1300],       # ~15k
    ['MOONG', 'Moong', 1000, 2800, 1500, 4000, 1500, 1200],   # ~12k
    ['URAD', 'Urad', 1100, 3000, 1600, 4200, 1600, 1000],     # ~12.5k
    ['GRAM', 'Gram', 1500, 3200, 2000, 4500, 1800, 1000],     # ~14k
    ['SOYBEAN', 'Soybean', 2000, 3500, 2500, 5000, 2000, 1000], # ~16k
    ['COTTON', 'Cotton', 2500, 5000, 4000, 8000, 3000, 1500], # ~24k
    ['GROUNDNUT', 'Groundnut', 3500, 4000, 1500, 6500, 2500, 1500], # ~19.5k
    ['SUNFLOWER', 'Sunflower', 1200, 3500, 1800, 5000, 2000, 1500], # ~15k
    ['SUGARCANE', 'Sugarcane', 6000, 12000, 3000, 15000, 8000, 6000], # ~50k
    ['ONION', 'Onion', 4000, 8000, 4000, 14000, 5000, 3500],  # ~38.5k
    ['TOMATO', 'Tomato', 5000, 9000, 6000, 15000, 6000, 3000] # ~44k
]
df_costs = pd.DataFrame(costs_data, columns=['crop_id', 'crop_name', 'seeds_cost_per_acre', 'fertilizer_cost_per_acre', 'pesticide_cost_per_acre', 'labor_cost_per_acre', 'machinery_cost_per_acre', 'irrigation_cost_per_acre'])
df_costs['total_cost_per_acre'] = df_costs[['seeds_cost_per_acre', 'fertilizer_cost_per_acre', 'pesticide_cost_per_acre', 'labor_cost_per_acre', 'machinery_cost_per_acre', 'irrigation_cost_per_acre']].sum(axis=1)
df_costs.to_csv(os.path.join(out_dir, 'cacp_costs_pune.csv'), index=False)

# 2. agmarknet_mandi_prices_pune.csv
prices_data = []
base_prices = {
    'SOYBEAN': 4700, 'MAIZE': 2100, 'JOWAR': 3200, 'BAJRA': 2300, 'WHEAT': 2500,
    'TUR': 7200, 'MOONG': 7200, 'URAD': 6500, 'GRAM': 5100, 'COTTON': 6400,
    'GROUNDNUT': 5500, 'SUNFLOWER': 5700, 'SUGARCANE': 315, 'ONION': 2000, 'TOMATO': 2200
}
names = {row[0]: row[1] for row in costs_data}

for crop in base_prices:
    for year in range(2020, 2027):
        inflation = 1.0 + (year - 2020) * 0.04
        yearly_base = base_prices[crop] * inflation
        
        # generate 12 monthly prices
        monthly_prices = []
        for month in range(1, 13):
            # seasonal variation
            season_factor = 1.0 - 0.15 * np.cos((month - 6) * np.pi / 6)
            noise = np.random.normal(1.0, 0.05)
            if crop in ['ONION', 'TOMATO']:
                season_factor = 1.0 - 0.4 * np.cos((month - 8) * np.pi / 6)
                noise = np.random.normal(1.0, 0.15)
                
            price = yearly_base * season_factor * noise
            monthly_prices.append(price)
            
        annual_avg = np.mean(monthly_prices)
        for month in range(1, 13):
            modal_price = round(monthly_prices[month-1])
            seasonal_index = round(monthly_prices[month-1] / annual_avg, 3)
            prices_data.append([crop, names[crop], year, month, modal_price, seasonal_index])

df_prices = pd.DataFrame(prices_data, columns=['crop_id', 'crop_name', 'year', 'month', 'modal_price_per_qtl', 'seasonal_index'])
df_prices.to_csv(os.path.join(out_dir, 'agmarknet_mandi_prices_pune.csv'), index=False)

# 3. district_sowing_windows.csv
sowing_data = [
    ['SOYBEAN', 'Soybean', 'Kharif', '06-15', '07-10', '07-25', 'Oct'],
    ['MAIZE', 'Maize', 'Kharif', '06-15', '07-15', '07-30', 'Sep-Oct'],
    ['JOWAR', 'Jowar', 'Kharif', '07-01', '07-30', '08-15', 'Oct-Nov'],
    ['BAJRA', 'Bajra', 'Kharif', '06-20', '07-15', '07-30', 'Sep-Oct'],
    ['WHEAT', 'Wheat', 'Rabi', '11-01', '11-25', '12-15', 'Mar'],
    ['TUR', 'Tur', 'Kharif', '06-15', '07-15', '07-30', 'Dec-Jan'],
    ['MOONG', 'Moong', 'Kharif', '06-20', '07-10', '07-25', 'Sep'],
    ['URAD', 'Urad', 'Kharif', '06-20', '07-10', '07-25', 'Sep'],
    ['GRAM', 'Gram', 'Rabi', '10-15', '11-10', '11-25', 'Feb'],
    ['COTTON', 'Cotton', 'Kharif', '05-25', '06-25', '07-10', 'Nov-Dec'],
    ['GROUNDNUT', 'Groundnut', 'Kharif', '06-15', '07-10', '07-25', 'Oct'],
    ['SUNFLOWER', 'Sunflower', 'Rabi', '10-01', '10-30', '11-15', 'Feb'],
    ['SUGARCANE', 'Sugarcane', 'Adsali/Suru', '01-15', '02-28', '03-15', 'Dec-Jan'],
    ['ONION', 'Onion', 'Rabi', '10-15', '11-15', '12-01', 'Feb-Mar'],
    ['TOMATO', 'Tomato', 'Rabi', '09-15', '10-15', '11-01', 'Jan-Feb']
]
df_sowing = pd.DataFrame(sowing_data, columns=['crop_id', 'crop_name', 'season', 'optimal_sowing_start', 'optimal_sowing_end', 'late_cutoff_date', 'harvest_month'])
df_sowing.to_csv(os.path.join(out_dir, 'district_sowing_windows.csv'), index=False)

# 4. pune_crop_yield_historical.csv
base_yields = {
    'SOYBEAN': 9.5, 'MAIZE': 24.0, 'JOWAR': 9.0, 'BAJRA': 12.0, 'WHEAT': 14.0,
    'TUR': 6.5, 'MOONG': 4.5, 'URAD': 4.0, 'GRAM': 7.0,
    'COTTON': 7.8, 'GROUNDNUT': 8.5, 'SUNFLOWER': 6.0,
    'SUGARCANE': 350.0, 'ONION': 60.0, 'TOMATO': 80.0
}
soil_mods = {'BLACK': 1.0, 'LOAM': 0.95, 'RED': 0.85, 'CLAY': 0.82, 'SANDY': 0.75}
water_mods = {3: 1.0, 2: 0.88, 1: 0.72}

n_samples = 2500
crops_list = list(base_yields.keys())
probs = [0.15, 0.12, 0.05, 0.05, 0.05, 0.10, 0.03, 0.03, 0.05, 0.12, 0.05, 0.03, 0.05, 0.06, 0.06]

sample_crops = np.random.choice(crops_list, size=n_samples, p=probs)
soils = np.random.choice(list(soil_mods.keys()), size=n_samples, p=[0.6, 0.2, 0.1, 0.05, 0.05])
waters = np.random.choice([1, 2, 3], size=n_samples, p=[0.3, 0.4, 0.3])

# delays mostly 0-15
delays = np.clip(np.random.exponential(scale=7.0, size=n_samples).astype(int), 0, 30)
prev_matches = np.random.choice([0, 1], size=n_samples, p=[0.4, 0.6])

yields_data = []
for i in range(n_samples):
    crop = sample_crops[i]
    s = soils[i]
    w = waters[i]
    d = delays[i]
    pm = prev_matches[i]
    
    y = base_yields[crop]
    y *= soil_mods[s]
    y *= water_mods[w]
    y *= max(0.5, 1.0 - d * 0.015)
    y *= (1.0 if pm == 1 else 0.92)
    y *= np.random.normal(1.0, 0.08) # noise
    
    y = round(max(0.1, y), 2)
    yields_data.append([i+1, crop, s, w, d, pm, y])

df_yields = pd.DataFrame(yields_data, columns=['sample_id', 'crop_id', 'soil_type', 'water_level', 'sowing_delay_days', 'prev_crop_match', 'yield_qtl_per_acre'])
df_yields.to_csv(os.path.join(out_dir, 'pune_crop_yield_historical.csv'), index=False)

print(f"cacp_costs_pune.csv: {len(df_costs)} rows")
print(f"agmarknet_mandi_prices_pune.csv: {len(df_prices)} rows")
print(f"district_sowing_windows.csv: {len(df_sowing)} rows")
print(f"pune_crop_yield_historical.csv: {len(df_yields)} rows")
