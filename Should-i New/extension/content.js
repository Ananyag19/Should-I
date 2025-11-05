console.log("✅ Content script loaded successfully");

// Function to extract product data from the Amazon page
function extractProductData() {
  const titleElement = document.getElementById("productTitle");
  const ratingElement = document.querySelector(".a-icon-alt");
  const reviewElements = document.querySelectorAll(".review-text-content span");

  const title = titleElement ? titleElement.innerText.trim() : "Unknown Product";
  const rating = ratingElement ? parseFloat(ratingElement.innerText) : null;

  const reviews = [];
  reviewElements.forEach((el) => {
    if (el.innerText.trim()) reviews.push(el.innerText.trim());
  });

  console.log("📦 Extracted product data:", { title, rating, reviews });
  return { title, rating, reviews };
}

// Function to send product data to the Flask backend
async function analyzeProduct(data) {
  try {
    console.log("🚀 Sending product data to backend:", data);
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to fetch trust score from backend");

    const result = await response.json();
    console.log("✅ Trust analysis result:", result);
    displayTrustBadge(result);
  } catch (error) {
    console.error("❌ Error during backend call:", error);
  }
}

// Function to display the trust badge on the Amazon page
function displayTrustBadge(result) {
  // Remove existing badge if any
  const oldBadge = document.getElementById("trust-badge");
  if (oldBadge) oldBadge.remove();

  // Create badge container
  const badge = document.createElement("div");
  badge.id = "trust-badge";
  badge.style.position = "fixed";
  badge.style.bottom = "20px";
  badge.style.right = "20px";
  badge.style.background = "#fff";
  badge.style.border = "2px solid #000";
  badge.style.borderRadius = "15px";
  badge.style.padding = "15px";
  badge.style.boxShadow = "0px 4px 12px rgba(0,0,0,0.2)";
  badge.style.zIndex = "9999";
  badge.style.fontFamily = "Arial, sans-serif";
  badge.style.width = "260px";
  badge.style.transition = "all 0.3s ease-in-out";

  // Determine conclusion
  let conclusion = "";
  let color = "#000";

  if (result.genuine_count > result.fake_count) {
    conclusion = "✅ Genuine product. You should buy it.";
    color = "#16a34a";
  } else if (result.fake_count > result.genuine_count) {
    conclusion = "❌ Fake product. Avoid it.";
    color = "#dc2626";
  } else {
    conclusion = "⚠️ Mixed reviews. Undefined conclusion.";
    color = "#facc15";
  }

  badge.innerHTML = `
    <div style="font-size:18px; font-weight:bold; color:${color}; margin-bottom:6px;">
      Trust Score: ${result.trust_score || "N/A"}
    </div>
    <div style="font-size:14px; margin-bottom:8px;">
      Genuine Reviews: <b>${result.genuine_count}</b><br>
      Fake Reviews: <b>${result.fake_count}</b>
    </div>
    <div style="font-size:15px; font-weight:bold; color:${color};">${conclusion}</div>
  `;

  document.body.appendChild(badge);
  console.log("🏷️ Trust badge displayed successfully");
}

// Main execution
(function () {
  const productData = extractProductData();
  if (productData.reviews.length > 0) {
    analyzeProduct(productData);
  } else {
    console.warn("⚠️ No reviews found on this product page.");
  }
})();
