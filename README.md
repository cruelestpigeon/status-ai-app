
Status-style Personal PWA — Modern UI
===================================

This is a single-page Progressive Web App intended for local personal use on your iPhone.

Features:
- Social feed with posts and replies
- Characters (AI bots) with editable profiles and memory
- Universe / lore editor
- DM chat with characters
- Characters auto-post once when you post
- Threaded replies generated on demand
- Uses free HuggingFace public inference endpoints (no key) with local fallback

How to use (non-technical):
1. Upload the folder to GitHub as a new repository (web UI).
2. Enable GitHub Pages in repository settings (branch: main, folder: /).
3. Open the published URL in Safari on iPhone and Add to Home Screen.

Files of interest:
- public/index.html, styles.css, manifest.json, sw.js
- src/App.js (main app)
- src/components/* (UI components)
- src/lib/* (storage and AI logic)

Privacy:
All data is stored in your device's IndexedDB. Remote calls only happen when the HF model is used; fallback is fully local.

