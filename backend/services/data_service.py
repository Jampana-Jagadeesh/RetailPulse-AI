import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

import pandas as pd
import pickle
from functools import lru_cache
from src.data_processing import load_and_clean_data
from src.rfm import create_rfm
from src.segmentation import perform_clustering
from src.clv_model import train_clv_model
from src.inventory import get_inventory_intelligence
from src.recommendations import get_recommendations

BASE       = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
XLSX_PATH  = os.path.join(BASE, 'data', 'Online Retail.xlsx')
CSV_PATH   = os.path.join(BASE, 'data', 'retail.csv')
CACHE_PATH = os.path.join(BASE, 'data', 'cache.pkl')

def _build_cache():
    if not os.path.exists(CSV_PATH):
        print("[RetailPulse] Converting Excel to CSV (one-time)...")
        pd.read_excel(XLSX_PATH).to_csv(CSV_PATH, index=False)

    print("[RetailPulse] Loading data...")
    df = load_and_clean_data(CSV_PATH)

    print("[RetailPulse] RFM + clustering + CLV...")
    rfm = create_rfm(df)
    rfm, _ = perform_clustering(rfm)
    _, rfm = train_clv_model(rfm)
    rfm["Segment_Label"] = rfm["Segment"].map({0:"Champions",1:"Loyal",2:"Potential",3:"At Risk"})

    print("[RetailPulse] Inventory intelligence...")
    inventory = get_inventory_intelligence(df)

    print("[RetailPulse] Association rules (~5s)...")
    rules = get_recommendations(df)

    payload = (df, rfm, inventory, rules)
    with open(CACHE_PATH, 'wb') as f:
        pickle.dump(payload, f)
    print("[RetailPulse] Cache saved. Ready.")
    return payload

@lru_cache(maxsize=1)
def get_data():
    if os.path.exists(CACHE_PATH):
        print("[RetailPulse] Loading from cache...")
        with open(CACHE_PATH, 'rb') as f:
            return pickle.load(f)
    return _build_cache()

def invalidate_cache():
    get_data.cache_clear()
    if os.path.exists(CACHE_PATH):
        os.remove(CACHE_PATH)
