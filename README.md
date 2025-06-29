# Should-I: AI-powered Amazon Product Trust Detector

## Overview

**Should-I** is a Chrome extension that helps users decide whether to trust an Amazon.in product or seller. It analyzes product details and reviews, then displays a trust badge directly on the product page.

## Features

- Scrapes product title, seller, and reviews from Amazon.in product pages
- Sends this data to a backend AI service for analysis
- Displays a trust badge: "Trusted", "Suspicious", or "Do Not Buy"
- Easy-to-use browser extension interface

## Project Structure

```
New/
├── backend/
│   ├── app.py             # Flask API server
│   └── trust_score.py     # Trust scoring logic
├── extension/
│   ├── manifest.json      # Chrome extension manifest
│   ├── content.js         # Main content script (scrapes & injects badge)
│   ├── background.js      # Extension background script
│   ├── popup.html         # Popup UI (minimal)
│   ├── popup.js           # (empty)
│   ├── assets/            # Badge and icon images
├── t, b, e                # (likely temp/test files)
```

## How it Works

1. The extension loads on Amazon.in product pages.
2. It collects the product title, seller, and reviews.
3. This data is sent to the backend `/analyze` API (Flask).
4. The backend assigns a trust score and returns a badge tag.
5. The extension injects a visual badge below the product title.

## Setup

### Backend

1. Go to `New/backend/`
2. Install dependencies: `pip install flask flask-cors`
3. Run: `python app.py` (runs on `localhost:5000`)

### Extension

1. Go to `chrome://extensions/` in your browser.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `New/extension/` folder.

## Customization

- Extend `trust_score.py` for more advanced scoring.
- Update `content.js` for different marketplaces/page layouts.

## Credits

- Created by Swastik-Prakash1 & Ananyag19.

---

**Feel free to open issues or submit PRs for improvements!**
