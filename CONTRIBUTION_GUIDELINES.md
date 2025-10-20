<p align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">
</p>

# 🌟 HrRoadways – Contribution Guidelines

<h4 align="center">
A clear, structured guide to contributing to HrRoadways, keeping the codebase updated, and working with translations.
</h4>
<p align="center">
  <img src="https://img.shields.io/badge/Contribute-Guide-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Open%20Source-Community-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge" />
</p>

---

## 📝 Why Contribute?

Your contributions help:

- ✅ Keep **bus routes, schedules, and places accurate**  
- 🌏 Make the platform **accessible across 13 Indian languages**  
- ⚡ Improve **UI/UX, performance, and user experience**  
- 🤝 Enable **community-driven improvements**  
- 💡 Help **commuters across India** with reliable data  

<p align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">
</p>

---

## 🔧 How to Contribute

Follow these **7 simple steps** for a smooth contribution:

### 1️⃣ Fork the Repository
Click the **Fork** button on the top-right of the repo.

### 2️⃣ Clone Your Fork
```bash
git clone https://github.com/your-username/HrRoadways.git
cd HrRoadways
```
### 3️⃣ Create a New Branch
```bash
git checkout -b feature/your-feature-name
```
Tip: Name your branch based on the task, e.g., feature/add-hindi-translations or fix/navbar-bug.
---
### 4️⃣ Make Your Changes
Add new content, pages, or features.

Compress images (PNG/JPG) before uploading.

Ensure code readability and maintain existing coding style.

For new content, add English translations.

Additional language translations are optional; the system supports 13 languages (hi, bn, te, mr, ta, gu, kn, ml, pa, or, as, ur).

###5️⃣ Commit Your Changes
```bash
git add .
git commit -m "Brief, clear description of your changes"
```
#### 6️⃣ Push to Your Branch
```bash
git push origin feature/your-feature-name
```
### 7️⃣ Create a Pull Request

7️⃣ Create a Pull Request

Go to the original HrRoadways repo → New Pull Request.

Write a clear title and description.

Reference any issues your PR addresses.

Be polite and concise.

<p align="center"> <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%"> </p>

### 🔄Keeping Your Fork Updated
```bash
# Add upstream remote
git remote add upstream https://github.com/NishantRana07/HrRoadways.git

# Fetch upstream changes
git fetch upstream

# Merge changes into main
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main
```
~This ensures your PR doesn’t have merge conflicts.
#### 🌐 Translation Guidelines (i18n)

HrRoadways supports 13 Indian languages. When adding new content:

✅ Provide English translation (mandatory)

⚡ Additional languages can be added optionally in src/i18n/locales/

Use useTranslation() hook and reference keys with {t('namespace.key')}

Maintain clear, consistent key names

<p align="center"> <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%"> </p>

## 🐞 Troubleshooting Guide

| 🔹 Issue | ⚡ Possible Solution |
|----------|--------------------|
| **App won’t start** | - Ensure Node.js version 16+ is installed<br>- Run `npm install` in the repo root<br>- Check if the dev server port is free; kill conflicting processes or change port |
| **Missing translations / UI shows keys** | - Confirm JSON files exist under `src/i18n/locales/`<br>- Restart dev server after adding new keys<br>- Use `useTranslation()` and call `t('namespace.key')` correctly |
| **Data/API not loading** | - Verify JSON/DB endpoint is reachable<br>- Check CORS settings if using hosted JSON blob<br>- Inspect browser console/network tab for 4xx/5xx errors |
| **Images fail to upload or display** | - Confirm storage URL/CORS settings<br>- Check file size limits<br>- Compress images (PNG/JPG) before uploading |
| **Language switch not persisting** | - Save selected language to `localStorage` or user profile<br>- Ensure state is read on app init before rendering locale-dependent components |
| **Build/Production issues** | - Verify environment variables for production (`API base URL`, keys, etc.)<br>- Run a local production build (`npm run build`) and serve `dist` to reproduce issues |
---
###💡 Best Practices

✅ Keep your fork up-to-date before submitting PRs

✅ Use clear commit messages

✅ Test features locally before PR submission

✅ Follow consistent coding conventions

✅ Compress images before adding to the repo

✅ Ensure new content has at least an English translation
---
### 💖 Contributor Appreciation
A big thank you to all contributors! 🚀
<p align="center">
  <a href="https://github.com/NishantRana07/HrRoadways/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=NishantRana07/HrRoadways" />
  </a>
</p>

