import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def build_daily_revenue(df):
    daily = df.groupby(df['InvoiceDate'].dt.date)['Revenue'].sum().reset_index()
    daily.columns = ['ds', 'y']
    daily['ds'] = pd.to_datetime(daily['ds'])
    return daily.sort_values('ds')

def forecast_revenue(df, days=30):
    daily = build_daily_revenue(df)
    daily['t'] = np.arange(len(daily))

    model = LinearRegression()
    model.fit(daily[['t']], daily['y'])

    last_t = daily['t'].max()
    last_date = daily['ds'].max()
    future_t = np.arange(last_t + 1, last_t + 1 + days).reshape(-1, 1)
    future_dates = pd.date_range(last_date + pd.Timedelta(days=1), periods=days)

    forecast = pd.DataFrame({
        'ds': future_dates,
        'yhat': model.predict(future_t)
    })
    return daily, forecast

def detect_demand_spikes(df, threshold=2.0):
    daily = build_daily_revenue(df)
    mean, std = daily['y'].mean(), daily['y'].std()
    spikes = daily[daily['y'] > mean + threshold * std].copy()
    spikes['spike_pct'] = ((spikes['y'] - mean) / mean * 100).round(1)
    return spikes
