console.log("🧠 Should I? Extension Loaded");

const titles = [...document.querySelectorAll("span.a-text-normal")];

titles.forEach(titleEl => {
  const title = titleEl.innerText;

  fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, reviews: [] })
  })
  .then(res => res.json())
  .then(data => {
    const badge = document.createElement("span");
    badge.style.marginLeft = "10px";
    badge.style.fontWeight = "bold";

    if (data.trust_tag === "RED") {
      badge.textContent = "❌ Fake";
      badge.style.color = "red";
    } else if (data.trust_tag === "YELLOW") {
      badge.textContent = "⚠️ Caution";
      badge.style.color = "orange";
    } else {
      badge.textContent = "✅ Trusted";
      badge.style.color = "green";
    }

    titleEl.appendChild(badge);
  });
});
