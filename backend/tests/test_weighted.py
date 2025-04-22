# backend/test_weighted.py

from matching.weighted_score import rank_cities

user_preferences = {
    "budget": 0.3,
    "climate": 0.2,
    "nightlife": 0.15,
    "walkability": 0.1,
    "job_market": 0.15,
    "safety": 0.1
}

city_data = {
    "Austin": {"budget": 0.6, "climate": 0.75, "nightlife": 0.85, "walkability": 0.7, "job_market": 0.65, "safety": 0.7},
    "New York": {"budget": 0.2, "climate": 0.6, "nightlife": 0.95, "walkability": 0.9, "job_market": 0.8, "safety": 0.4}
}

top_cities = rank_cities(city_data, user_preferences)
print("🏙️ Weighted Score Results:")
for city, score in top_cities:
    print(f"{city}: {score:.3f}")