# backend/test_faiss.py

from matching.faiss_search import search_similar_cities
import numpy as np

# Mock city vectors (5 cities, 128-dim vectors)
city_names = ["Austin", "New York", "Denver", "Boston", "Seattle"]
city_vectors = np.random.rand(5, 128).astype('float32')
user_vector = np.random.rand(1, 128).astype('float32')

top_indices, distances = search_similar_cities(city_vectors, user_vector, top_k=3)

print("🧠 Faiss Similar Cities:")
for i, idx in enumerate(top_indices):
    print(f"{city_names[idx]} (distance: {distances[i]:.4f})")