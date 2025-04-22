# backend/matching/weighted_score.py

def compute_city_score(city_attrs, user_prefs):
    return sum(city_attrs[k] * user_prefs[k] for k in user_prefs)

def rank_cities(city_db, user_prefs):
    scored = []
    for city_name, attrs in city_db.items():
        score = compute_city_score(attrs, user_prefs)
        scored.append((city_name, score))
    
    return sorted(scored, key=lambda x: x[1], reverse=True)