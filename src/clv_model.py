from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

def train_clv_model(rfm):
    X = rfm[['Recency','Frequency']]
    y = rfm['Monetary']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = RandomForestRegressor()
    model.fit(X_train, y_train)

    rfm['Predicted_CLV'] = model.predict(X)

    return model, rfm