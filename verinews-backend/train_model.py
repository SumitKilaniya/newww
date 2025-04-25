import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# Load dataset
df = pd.read_csv('fake_or_real_news.csv')  # or 'Fake.csv' based on your dataset name

# If dataset has title & text columns, merge them
df['text'] = df['title'] + ' ' + df['text']

# Target label: FAKE = 1, REAL = 0
df['label'] = df['label'].map({'FAKE': 1, 'REAL': 0})

X = df['text']
y = df['label']

# Convert text to TF-IDF features
vectorizer = TfidfVectorizer(stop_words='english')
X_vectorized = vectorizer.fit_transform(X)

# Train logistic regression model
model = LogisticRegression()
model.fit(X_vectorized, y)

# Save vectorizer and model
pickle.dump(vectorizer, open('vectorizer.pkl', 'wb'))
pickle.dump(model, open('model.pkl', 'wb'))

print("✅ Model and vectorizer saved successfully!")
