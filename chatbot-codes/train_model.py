import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# --- DAY 1: ONLY TRAINING SEARCH HACKATHON ---
data = [
    ("search hackathon"),
    ("hi", "other"),
    ("hello", "other")
]

texts, labels = zip(*data)

# The Pipeline (Vectorizer + Classifier)
model = make_pipeline(TfidfVectorizer(), MultinomialNB())

print("Training Day 1: Single Intent...")
model.fit(texts, labels)

# Save the brain (model.pkl)
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Day 1 Brain Saved!")