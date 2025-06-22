from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app, resources={r"/analyze": {"origins": "*"}})  # Allow all origins for /analyze

# Load LLM pipeline
ai_review_detector = pipeline("text-classification", model="roberta-base-openai-detector", top_k=None)

# Keywords for frequent returns
return_keywords = ["returned", "refund", "exchange", "defective", "not working"]

@app.route('/analyze', methods=['POST'])
def analyze_product():
    data = request.json
    title = data.get('title', '')
    reviews = data.get('reviews', [])

    ai_review_flag = False
    return_flag = False

    for review in reviews:
        # AI detection
        prediction = ai_review_detector(review)[0]
        if prediction['label'].lower() == "fake" or prediction['score'] > 0.85:
            ai_review_flag = True

        # Check for return keywords
        if any(keyword in review.lower() for keyword in return_keywords):
            return_flag = True

    if return_flag:
        trust_tag = "RED"
        reason = "Too many returns"
    elif ai_review_flag:
        trust_tag = "YELLOW"
        reason = "Suspicious reviews"
    else:
        trust_tag = "GREEN"
        reason = ""

    return jsonify({
        "trust_tag": trust_tag,
        "reason": reason
    })

if __name__ == '__main__':
    app.run(debug=True)
