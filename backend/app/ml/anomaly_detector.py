from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer

def detect_anomalies(logs):
    if not logs or len(logs) < 3:
        return []

    messages = [log.message for log in logs]

    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(messages)

    model = IsolationForest(contamination=0.2, random_state=42)
    predictions = model.fit_predict(X.toarray())

    results = []
    for log, pred in zip(logs, predictions):
        results.append({
            "id": str(log.id),
            "timestamp": log.timestamp.isoformat() if log.timestamp else None,
            "level": log.level,
            "service": log.service,
            "message": log.message,
            "is_anomaly": bool(pred == -1)
        })

    return results