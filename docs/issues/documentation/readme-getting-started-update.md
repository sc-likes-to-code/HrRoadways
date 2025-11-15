## 📝 Description

The "Getting Started" section in README.md needs updating to clarify frontend and backend setup instructions, including accurate port information and development vs production modes.

---

## 📚 Current Issue

**Problems identified:**

1. **Unclear server modes**: The original instructions didn't distinguish between development mode (Vite dev server) and production mode (Express serving built frontend)

2. **Incorrect port information**: 
   - Stated backend runs on port 5000, but it actually runs on port 50001 (as configured in `.env`)
   - Didn't explain that frontend runs on different ports in dev vs production

3. **Missing context**: 
   - No explanation that backend serves both API and frontend in production mode
   - Didn't clarify when to use `npm run dev` vs `npm run build` + production server

4. **Redundant steps**: Steps 4 and 5 were unnecessarily verbose with unclear separation between optional and required setups

---

## 🧠 Suggested Update

**Location:** `README.md` - "Getting Started" section

**Changes implemented:**

### 1. Streamlined initial setup steps
- Kept steps 1-3 clear and concise (clone, install, .env setup)

### 2. Added "Frontend Development" section with two modes:

**Development mode** (for active coding):
```bash
npm run dev
```
- Runs on `http://localhost:5173` (Vite dev server)
- Hot reload enabled
- Faster development workflow

**Production mode** (for testing production build):
```bash
npm run build
NODE_ENV=production npm run server
```
- Runs on `http://localhost:50001` (Express serves built frontend)
- Tests production deployment locally

### 3. Added "Backend Server" section with clear modes:
```bash
npm run server
```
- **Development mode**: API only on port 50001
- **Production mode** (with `NODE_ENV=production`): Serves both API and frontend from `/dist`

### 4. Accurate port information:
- Frontend dev: `5173` (Vite default)
- Backend/Production: `50001` (from `.env` PORT variable)

---

## ✅ Checklist

- [x] I have checked if this documentation section already exists.  
- [x] I have clearly described what needs to be updated or added.
- [x] Port numbers verified against actual configuration (`.env` and `mainServer.js`)
- [x] Development and production modes clearly distinguished
- [x] Instructions tested and confirmed working
