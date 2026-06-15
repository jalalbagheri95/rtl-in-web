<div style="text-align:center">

![icon](icons/icon128.png)

</div>

# RTL in Web

A lightweight Firefox add-on that forces **ChatGPT** and **DeepSeek** interfaces to display in **Persian (fa-IR)** with **right-to-left (RTL)** layout.  
This add-on is designed for Persian users who want ChatGPT and DeepSeek to look more natural in their language.

## Features

- ✅ Automatically sets `<html dir="rtl" lang="fa-IR">`.
- ✅ Applies the custom Persian font (Vazirmatn, designed by Saber Rasti Kerdar) for better readability.
- ✅ **Toggle Button** to enable/disable RTL on-the-fly (displays "English" when enabled, "فارسی" when disabled).
- ✅ Persistent toggle state across page reloads (stored in localStorage).
- ✅ Intelligent button placement:
  - **ChatGPT**: Placed inside the model-switcher header container.
  - **DeepSeek**: Fixed position (top-right) when no suitable container is found.
- ✅ Lightweight: Only runs on target websites.
- ✅ Fully compatible with Manifest V3.
- ✅ Open Source (GPL v2).

---

## Installation

### From Firefox Add-ons (AMO)

1. Visit [RTL in Web on Firefox Add-ons](https://addons.mozilla.org/addon/rtl-in-web/).
2. Click "Add to Firefox".
3. Confirm the installation.

### Local Development

1. Clone or download the repository:
   ```bash
   git clone https://github.com/jalalbagheri95/rtl-in-web.git
   cd rtl-in-web
   ```
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on**.
4. Select the `manifest.json` file from this project.
5. Open [ChatGPT](https://chat.openai.com/) or [DeepSeek](https://deepseek.com) → the page will automatically switch to RTL and Persian.

---

## Usage

Once installed, the add-on works automatically on supported sites:

- **Toggle RTL**: Click the button labeled "English" (when RTL is on) or "فارسی" (when RTL is off) to switch modes.
- **Persistence**: Your preference is saved and restored when you revisit the site.
- **Auto-restore**: If the toggle button is removed during page updates, it is automatically restored.

---

## Technical Details

### Architecture

- **rtl-script.js**: Main logic for RTL injection, toggle button creation, and DOM observer for button persistence.
- **rtl-style.css**: Styling for the toggle button, including normal and fixed-position variants.
- **manifest.json**: Firefox extension manifest (Manifest V3).

### Key Implementation

- Uses MutationObserver to monitor DOM changes and restore the toggle button if it's removed.
- Intelligent placement detection based on hostname and available container elements.
- CSS classes (`rtl-in-web-toggle`, `rtl-in-web-toggle--fixed`) for lightweight styling.
- localStorage for persistent toggle state.

---

## Source Code

The full source code is available on GitHub:  
**[github.com/jalalbagheri95/rtl-in-web](https://github.com/jalalbagheri95/rtl-in-web)**

---

## Changelog

### v1.3 (Latest)

- ✨ Added persistent toggle button with smart placement (ChatGPT vs. DeepSeek).
- ✨ Button automatically restores if removed during page updates (MutationObserver).
- ✨ Moved all button styling to CSS (reduced inline styles in JS).
- ✨ Toggle button text now shows "English" (when enabled) or "فارسی" (when disabled).
- 🔧 Refactored DOM detection logic for better reliability.
- 📦 Updated to Manifest V3 for future Firefox compatibility.

### v1.0

- Initial release with basic RTL support for ChatGPT.

---

## License

This project is licensed under **GPL v2**.  
Font Software is licensed under the SIL Open Font License, Version 1.1. See [OFL.txt](OFL.txt).

---

## Support & Issues

Found a bug? Have a feature request? Please open an issue on [GitHub Issues](https://github.com/jalalbagheri95/rtl-in-web/issues).

---

## Credits

- **Font**: [Vazirmatn](https://github.com/rastikerdar/vazirmatn) by Saber Rasti Kerdar.
- **Inspired by**: Persian language enthusiasts who want better RTL support on the web.

## Screenshots

### Before

![Before RTL](screenshots/before.png)

### After

![After RTL](screenshots/after.png)

---

## Change log

### version 1.3

- change add-on name
- add deepseek to target sites
- fix pre stlye
- add button to control rtl|ltr mode
