from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def perform_clustering(rfm):
    scaler = StandardScaler()
    rfm_scaled = scaler.fit_transform(rfm[['Recency','Frequency','Monetary']])

    kmeans = KMeans(n_clusters=4, random_state=42)
    rfm['Segment'] = kmeans.fit_predict(rfm_scaled)

    return rfm, kmeans