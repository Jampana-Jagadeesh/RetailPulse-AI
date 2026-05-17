import pandas as pd

def get_inventory_intelligence(df):
    product = df.groupby(['StockCode', 'Description']).agg(
        TotalRevenue=('Revenue', 'sum'),
        TotalQty=('Quantity', 'sum'),
        OrderCount=('InvoiceNo', 'nunique'),
        AvgPrice=('UnitPrice', 'mean')
    ).reset_index()

    v33 = product['TotalQty'].quantile(0.33)
    v66 = product['TotalQty'].quantile(0.66)

    def classify(qty):
        if qty >= v66:
            return 'Fast Moving'
        elif qty >= v33:
            return 'Slow Moving'
        return 'Dead Stock Risk'

    product['Status'] = product['TotalQty'].apply(classify)

    # Aging: products with very few recent orders
    recent_cutoff = df['InvoiceDate'].max() - pd.Timedelta(days=30)
    recent_products = df[df['InvoiceDate'] >= recent_cutoff]['StockCode'].unique()
    product['RecentActivity'] = product['StockCode'].isin(recent_products)

    return product.sort_values('TotalRevenue', ascending=False)
