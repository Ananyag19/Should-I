def generate_trust_score(data):
    title = data.get("title", "").lower()
    reviews = data.get("reviews", [])
    seller = data.get("seller", "").lower()

    score = 70  # default
    tag = "Trusted"

    if "bad" in title or "duplicate" in seller:
        score -= 30
    if any("fake" in review.lower() for review in reviews):
        score -= 20

    if score < 50:
        tag = "Do Not Buy"
    elif score < 70:
        tag = "Suspicious"

    return score, tag
