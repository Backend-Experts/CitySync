# backend/test_cf.py

from matching.collaborative_filter import train_cf_model, predict_city_scores
import pandas as pd

df = pd.DataFrame([
    ["user1", "Austin", 1.0],
    ["user1", "Denver", 0.9],
    ["user2", "Austin", 1.0],
    ["user2", "Boston", 0.5],
    ["user3", "Seattle", 1.0],
    ["user3", "Denver", 0.6]
], columns=["user_id", "city_id", "rating"])

print("📈 Training Collaborative Filtering model...")
model = train_cf_model(df)

print("🔍 Predicting scores for user1...")
preds = predict_city_scores(model, "user1", ["Austin", "Denver", "Boston", "Seattle"])
for city, score in preds:
    print(f"{city}: {score:.3f}")