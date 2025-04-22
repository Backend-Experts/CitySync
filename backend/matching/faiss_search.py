# backend/matching/faiss_search.py

import faiss
import numpy as np

def load_vectors(path):
    return np.load(path).astype('float32')

def search_similar_cities(city_vectors, user_vector, top_k=10):
    index = faiss.IndexFlatL2(city_vectors.shape[1])
    index.add(city_vectors)

    D, I = index.search(user_vector, top_k)
    return I[0], D[0]  # indices and distances