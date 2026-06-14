// RTL in Web content script
// This script applies RTL/Persian UI behavior on supported chat pages and adds a small toggle button.

//#region Core RTL / language state

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
    // Ignore storage failures and keep the extension working.
  }

  updateButton();
  applyState();
}

function applyState() {
  if (isDisabled()) {
    const root = document.documentElement;
    root.dir = "ltr";
    // Restore the original language if it exists; otherwise clear it.
    root.lang = root.lang && root.lang !== "fa-IR" ? root.lang : "";
  } else {
    setRTLAndPersian();
  }
}

//#endregion

//#region Toggle button creation and placement

function createToggleButton() {
  if (document.getElementById("rtl-in-web-toggle")) return;

  const btn = document.createElement("button");
  btn.id = "rtl-in-web-toggle";
  btn.type = "button";
  btn.title = "Toggle RTL";
  btn.textContent = isDisabled() ? "فارسی" : "English";

  // Keep a small inline fallback style; the main visual style is defined in CSS.
  btn.classList.add("rtl-in-web-toggle");
  Object.assign(btn.style, {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "background-color 0.2s",
  });

  // Fallback hover styling in case the CSS class is not fully applied.
  btn.addEventListener("mouseenter", () => {
    btn.style.backgroundColor = "var(--surface-hover, rgba(255,255,255,0.1))";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.backgroundColor = "transparent";
  });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setDisabled(!isDisabled());
  });

  // Choose the best insertion point depending on the current host.
  const host = window.location.hostname || "";
  const isChatGPT =
    host.includes("chat.openai.com") || host.includes("chatgpt.com");
  const isDeepSeek =
    host.includes("deepseek.com") || host.includes("chat.deepseek.com");

  let placed = false;

  if (isChatGPT) {
    const chatContainer = findLeftSideMenu();
    if (chatContainer) {
      // Add the toggle button at the end of the ChatGPT model-switcher area.
      chatContainer.appendChild(btn);
      placed = true;
    }
  }

  if (!placed && isDeepSeek) {
    const dsContainer = findTargetContainer();
    if (dsContainer) {
      // Use the DeepSeek header area when a suitable container is available.
      dsContainer.appendChild(btn);
      placed = true;
    } else {
      // DeepSeek has no stable container in this layout, so fall back to fixed positioning.
      addFallbackButton(btn);
      placed = true;
    }
  }

  if (!placed) {
    // For any other site or if the expected container is missing, use the fixed fallback.
    addFallbackButton(btn);
  }
}

function addFallbackButton(btn) {
  // Attach the button to the page body with the fixed-position CSS variant.
  btn.classList.add("rtl-in-web-toggle--fixed");
  document.body.appendChild(btn);
}

//#endregion

//#region Host-specific DOM lookup helpers

function findLeftSideMenu() {
  // Find the ChatGPT model-switcher container used in the top header area.
  const modelSwitcher = document.querySelector(
    'button[data-testid="model-switcher-dropdown-button"], button[aria-label*="Model selector"]',
  );

  if (!modelSwitcher) return null;

  // Prefer the nearest flex container; otherwise fall back to the parent element.
  const container =
    modelSwitcher.closest("div.flex.items-center") ||
    modelSwitcher.parentElement;

  return container || null;
}

function findTargetContainer() {
  // Find the DeepSeek header area that can host the toggle button.
  const header = document.querySelector('header[id="page-header"]');
  if (!header) return null;

  // Look for the right-side section used for login or utility buttons.
  const rightSection = header.querySelector('div[class*="col-start-3"]');
  if (!rightSection) return null;

  // Prefer a wrapper that already contains login/signup buttons.
  const buttonWrapper = rightSection.querySelector(
    'div:has(> button[data-testid="login-button"])',
  );

  return buttonWrapper || rightSection;
}

//#endregion

//#region Button label update

function updateButton() {
  const btn = document.getElementById("rtl-in-web-toggle");
  if (!btn) return;

  btn.textContent = isDisabled() ? "فارسی" : "English";
}

//#endregion

//#region Mutation observer for RTL state and re-attachment

const observer = new MutationObserver(() => {
  if (!isUpdating) {
    applyStateSafe();
  }
});

let isUpdating = false;

function applyStateSafe() {
  if (isUpdating) return;

  isUpdating = true;
  observer.disconnect();
  applyState();
  isUpdating = false;

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["dir", "lang"],
  });
}

function ensureToggleObserver() {
  // Watch the page DOM for re-renders and restore the toggle button if it disappears.
  let toggleMonitorTimer = null;

  const bodyObserver = new MutationObserver(() => {
    if (toggleMonitorTimer) clearTimeout(toggleMonitorTimer);

    toggleMonitorTimer = setTimeout(() => {
      const btn = document.getElementById("rtl-in-web-toggle");
      if (!btn) {
        createToggleButton();
        return;
      }

      const host = window.location.hostname || "";
      const isChatGPT =
        host.includes("chat.openai.com") || host.includes("chatgpt.com");
      const isDeepSeek =
        host.includes("deepseek.com") || host.includes("chat.deepseek.com");

      if (isChatGPT) {
        const chatContainer = findLeftSideMenu();
        if (chatContainer && btn.parentNode !== chatContainer) {
          chatContainer.appendChild(btn);
        }
      } else if (isDeepSeek) {
        const dsContainer = findTargetContainer();
        if (dsContainer && btn.parentNode !== dsContainer) {
          dsContainer.appendChild(btn);
        }
      }
    }, 150);
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });

  // Disconnect when the page is unloading to avoid unnecessary work.
  window.addEventListener("beforeunload", () => bodyObserver.disconnect());
}

//#endregion

//#region Initialization

function init() {
  setRTLAndPersian();
  createToggleButton();
  applyState();
  ensureToggleObserver();

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["dir", "lang"],
  });

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

//#endregion
