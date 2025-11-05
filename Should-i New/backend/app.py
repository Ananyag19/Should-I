from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import traceback
from trust_score import calculate_trust_score

app = Flask(__name__)
CORS(app)

# Load model & vectorizer
try:
    model = joblib.load("review_model.pkl")
    vectorizer = joblib.load("vectorizer.pkl")
    print("✅ Model and vectorizer loaded successfully.")
except Exception as e:
    print(f"[ERROR] Error loading model/vectorizer: {e}")
    model = None
    vectorizer = None


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        reviews = data.get("reviews", [])
        rating = float(data.get("rating", 0))

        if not reviews or model is None or vectorizer is None:
            return jsonify({"error": "No reviews or model not loaded"}), 400

        # Transform and predict
        X = vectorizer.transform(reviews)
        predictions = model.predict(X)

        fake_count = sum(1 for p in predictions if str(p).lower() in ["fake", "1", "f"])
        genuine_count = sum(1 for p in predictions if str(p).lower() in ["genuine", "0", "cg", "real"])

        # Calculate trust score
        trust_score = calculate_trust_score(fake_count, genuine_count, rating)

        # ✅ New: Verdict logic
        if fake_count > genuine_count:
            verdict = "Avoid buying — too many suspicious reviews 🚫"
        elif fake_count == genuine_count:
            verdict = "Unclear — reviews seem mixed ⚠️"
        else:
            verdict = "Looks trustworthy! You can buy ✅"

        return jsonify({
            "fake_count": fake_count,
            "genuine_count": genuine_count,
            "trust_score": trust_score,
            "verdict": verdict
        })

    except Exception as e:
        print("Error in /analyze:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
