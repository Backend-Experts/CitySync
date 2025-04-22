# backend/matching/collaborative_filter.py

from surprise import Dataset, Reader, SVD

def train_cf_model(interaction_data):
    """
    Trains a collaborative filtering model using matrix factorization (SVD).
    interaction_data: pandas DataFrame with columns [user_id, city_id, rating]
    """
    reader = Reader(rating_scale=(0, 1))
    data = Dataset.load_from_df(interaction_data, reader)
    trainset = data.build_full_trainset()

    model = SVD()
    model.fit(trainset)
    return model

def predict_city_scores(model, user_id, all_cities):
    preds = []
    for city in all_cities:
        pred = model.predict(user_id, city)
        preds.append((city, pred.est))
    return sorted(preds, key=lambda x: x[1], reverse=True)