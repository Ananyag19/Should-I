from flask import Flask, request, jsonify
from flask_cors import CORS
from trust_score import generate_trust_score

app = Flask(__name__)
CORS(app)  # allow all origins

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    score, tag = generate_trust_score(data)
    return jsonify({
        "trust_score": score,
        "tag": tag
    })

if __name__ == '__main__':
    app.run(debug=True)
