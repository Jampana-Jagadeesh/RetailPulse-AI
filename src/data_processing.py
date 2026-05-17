import pandas as pd

def load_and_clean_data(file_path):
    if str(file_path).endswith('.csv'):
        df = pd.read_csv(file_path, encoding='unicode_escape', low_memory=False)
    else:
        df = pd.read_excel(file_path)
    df = df.dropna(subset=['CustomerID'])
    df['CustomerID'] = df['CustomerID'].astype(int)
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
    df = df[(df['Quantity'] > 0) & (df['UnitPrice'] > 0)]

    # Feature Engineering
    df['Revenue'] = df['Quantity'] * df['UnitPrice']
    df['OrderMonth'] = df['InvoiceDate'].dt.to_period('M').astype(str)
    df['Weekday'] = df['InvoiceDate'].dt.day_name()
    df['Hour'] = df['InvoiceDate'].dt.hour

    basket = df.groupby('InvoiceNo')['StockCode'].count().rename('BasketSize')
    df = df.merge(basket, on='InvoiceNo')

    customer_spend = df.groupby('CustomerID')['Revenue'].sum().rename('CustomerSpend')
    purchase_freq = df.groupby('CustomerID')['InvoiceNo'].nunique().rename('PurchaseFrequency')
    df = df.merge(customer_spend, on='CustomerID').merge(purchase_freq, on='CustomerID')
    df['AverageOrderValue'] = df['CustomerSpend'] / df['PurchaseFrequency']

    product_velocity = df.groupby('StockCode')['InvoiceNo'].nunique().rename('ProductVelocity')
    df = df.merge(product_velocity, on='StockCode')

    # Keep TotalPrice as alias
    df['TotalPrice'] = df['Revenue']
    return df