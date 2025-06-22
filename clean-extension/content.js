console.log("🧠 Should I? Extension running on Amazon");

// Wait until rating is present in DOM
window.addEventListener("load", () => {
    setTimeout(() => {
        const ratingElement = document.querySelector('span.a-icon-alt');
        if (!ratingElement) {
            console.warn("⚠️ Rating not found — page might be loading content dynamically.");
            return;
        }

        const ratingText = ratingElement.textContent.trim(); // e.g. "4.3 out of 5 stars"
        const match = ratingText.match(/([\d.]+)\s+out/);
        if (!match) {
            console.warn("❌ Could not parse rating text.");
            return;
        }

        const rating = parseFloat(match[1]);
        let trustLabel = "";
        let imagePath = "";

        if (rating >= 4.0) {
            trustLabel = "Verified Trust Score";
            imagePath = chrome.runtime.getURL("icons/trust.png");
        } else if (rating >= 3.5) {
            trustLabel = "Suspicious";
            imagePath = chrome.runtime.getURL("icons/suspicious.png");
        } else {
            trustLabel = "Fake";
            imagePath = chrome.runtime.getURL("icons/fake.png");
        }

        const badge = document.createElement("div");
        badge.style.display = "flex";
        badge.style.alignItems = "center";
        badge.style.padding = "6px 12px";
        badge.style.borderRadius = "8px";
        badge.style.backgroundColor = "#f0f0f0";
        badge.style.boxShadow = "0 0 4px rgba(0,0,0,0.2)";
        badge.style.marginTop = "10px";
        badge.style.fontWeight = "bold";
        badge.style.fontSize = "14px";

        const icon = document.createElement("img");
        icon.src = imagePath;
        icon.alt = trustLabel;
        icon.style.width = "90px";
        icon.style.height = "90px";
        icon.style.marginRight = "10px";

        const text = document.createElement("span");
        text.textContent = trustLabel;

        badge.appendChild(icon);
        badge.appendChild(text);

        const insertionPoint = document.querySelector('#centerCol') || document.body;
        insertionPoint.prepend(badge);
    }, 1500);
});
