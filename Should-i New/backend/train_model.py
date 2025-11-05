import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import os

# Define dataset path
DATA_PATH = os.path.join("..", "data", "frd.csv")

# Load dataset
print("[INFO] Loading dataset...")
df = pd.read_csv(DATA_PATH)

# Check basic columns
print("[INFO] Columns:", df.columns)

# Handle different possible label column names
label_col = None
for col in df.columns:
    if "label" in col.lower():
        label_col = col
        break

if label_col is None:
    raise ValueError("No label column found in dataset!")

# Clean text and label
df = df.dropna(subset=[label_col])
df['text_'] = df['text_'].astype(str)
df[label_col] = df[label_col].apply(lambda x: 1 if str(x).strip().lower() in ['fake', 'cg', 'spam', 'fraud'] else 0)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    df['text_'], df[label_col], test_size=0.2, random_state=42, stratify=df[label_col]
)

# Vectorize text
print("[INFO] Vectorizing text...")
vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train model
print("[INFO] Training model...")
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# Evaluate
accuracy = model.score(X_test_vec, y_test)
print(f"[INFO] Model trained with accuracy: {accuracy*100:.2f}%")

# Save model and vectorizer
with open("review_model.pkl", "wb") as f:
    pickle.dump(model, f)
with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("[INFO] Model and vectorizer saved successfully!")
