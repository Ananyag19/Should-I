function getProductInfo() {
  const title = document.getElementById("productTitle")?.innerText || "";
  const seller = document.querySelector("#sellerProfileTriggerId")?.innerText || "";
  const reviews = Array.from(document.querySelectorAll(".review-text-content span"))
    .map(el => el.innerText.trim())
    .filter(text => text.length > 0)
    .slice(0, 10);

  return { title, seller, reviews };
}

function injectTrustBadge(tag) {
  const productTitle = document.getElementById("productTitle");
  if (!productTitle) return;

  const badge = document.createElement("div");
  badge.style.marginTop = "10px";

  const img = document.createElement("img");
  img.style.width = "120px";
  img.style.height = "auto";

  if (tag === "Trusted") {
    img.src = chrome.runtime.getURL("assets/trust.png");
    img.alt = "Trusted";
  } else if (tag === "Suspicious") {
    img.src = chrome.runtime.getURL("assets/suspicious.png");
    img.alt = "Suspicious";
  } else {
    img.src = chrome.runtime.getURL("assets/fake.png");
    img.alt = "Do Not Buy";
  }

  img.onerror = () => {
    img.alt = tag;
    img.style.background = "gray";
    img.innerText = tag;
  };

  badge.appendChild(img);
  productTitle.parentNode.insertBefore(badge, productTitle.nextSibling);
}

function fetchTrustDataAndInject() {
  const data = getProductInfo();
  if (data.title) {
    fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      injectTrustBadge(res.tag);
    })
    .catch(err => console.error("Backend error:", err));
  }
}

// No more floating logo or popup — only auto badge injection
if (window.location.href.includes("amazon")) {
  fetchTrustDataAndInject();
}
