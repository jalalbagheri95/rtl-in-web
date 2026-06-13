function setRTLAndPersian() {
  const root = document.documentElement;
  root.dir = "rtl";
  root.lang = "fa-IR";
}

const STORAGE_KEY = "rtl-in-web-disabled-v1";

function isDisabled() {
  return localStorage.getItem(STORAGE_KEY) === "1";
}

function setDisabled(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch (e) {
    // ignore storage errors
  }
  updateButton();
  applyState();
}

function applyState() {
  if (isDisabled()) {
    const root = document.documentElement;
    root.dir = "ltr";
    // keep original lang if any, or clear
    root.lang = root.lang && root.lang !== "fa-IR" ? root.lang : "";
  } else {
    setRTLAndPersian();
  }
}

function createToggleButton() {
  if (document.getElementById("rtl-in-web-toggle")) return;
  const btn = document.createElement("button");
  btn.id = "rtl-in-web-toggle";
  btn.type = "button";
  btn.title = "Toggle RTL";
  btn.textContent = isDisabled() ? "RTL Off" : "RTL On";
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "12px",
    right: "12px",
    zIndex: 2147483647,
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    background: isDisabled() ? "#666" : "#111",
    color: "#fff",
    opacity: "0.85",
    fontSize: "12px",
    cursor: "pointer",
  });
  btn.addEventListener("click", () => setDisabled(!isDisabled()));
  document.body.appendChild(btn);
}

function updateButton() {
  const btn = document.getElementById("rtl-in-web-toggle");
  if (!btn) return;
  btn.textContent = isDisabled() ? "RTL Off" : "RTL On";
  btn.style.background = isDisabled() ? "#666" : "#111";
}

function init() {
  setRTLAndPersian();
  createToggleButton();
  applyState();
  console.log(
    "RTL in Web: RTL and Persian language applied to",
    window.location.hostname,
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

const observer = new MutationObserver(() => {
  // Re-apply the current state (RTL or disabled) when dir/lang attributes change
  applyState();
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["dir", "lang"],
});
