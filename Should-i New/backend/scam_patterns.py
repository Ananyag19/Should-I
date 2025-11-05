import re

def detect_scam_patterns(text):
    patterns = [
        r"too good to be true",
        r"received product late",
        r"not as described",
        r"fake product"
    ]
    matches = [p for p in patterns if re.search(p, text.lower())]
    return len(matches) > 0
