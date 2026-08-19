# Fasal Disha (फसल-दिशा) — Production Deployment & Android Release Guide

This guide covers complete, 100% free hosting for the Frontend, Backend, PostgreSQL Database, and building the Android Release APK / AAB using Android Studio.

---

## 1. 🌐 Free PostgreSQL Database Hosting (Supabase / Neon)

### Option A: Supabase (Recommended — 500MB Free Dedicated PostgreSQL)
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, choose a region close to your users (e.g. `ap-south-1` Mumbai), and set a database password.
3. In **Project Settings** ➔ **Database** ➔ **Connection string** ➔ Select **URI** and copy:
   ```text
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```
4. All `JSONB`, `ARRAY`, GIN index, and UUID features will work natively!

---

## 2. ⚡ Free Backend Hosting on Render (FastAPI)

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** ➔ **Web Service** ➔ Select repository `agri-decide-sih`.
3. Configure the service:
   * **Name**: `fasal-disha-backend`
   * **Region**: `Singapore` / closest to your users
   * **Root Directory**: Leave blank (root `.`)
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -r backend/requirements.txt`
   * **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
   * **Instance Type**: `Free` (0.1 CPU, 512 MB RAM)
4. Add **Environment Variables**:
   * `DATABASE_URL`: `postgresql://postgres.[REF]:[PASSWORD]@.../postgres?sslmode=require`
   * `JWT_SECRET`: `fasal_disha_production_jwt_secret_key_2026`
   * `PYTHONPATH`: `.`
5. Click **Create Web Service**.
6. Once deployed, copy your live backend URL (e.g. `https://fasal-disha-backend.onrender.com`).
7. Run the one-time database seed via Render Shell:
   ```bash
   python backend/app/seed.py
   ```

---

## 3. 🚀 Free Frontend Hosting on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** ➔ **Project** ➔ Import `agri-decide-sih`.
3. Configure project settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Add **Environment Variable**:
   * `VITE_API_URL`: `https://fasal-disha-backend.onrender.com/api/v1`
5. Click **Deploy**.
6. Your web application is live with free global CDN and SSL!

---

## 4. 📱 Android Release Build (Android Studio & CLI)

The native Android project is generated in `frontend/android`.

### Method 1: Build directly in Android Studio (Recommended for Play Store)
1. Open **Android Studio**.
2. Click **File** ➔ **Open** ➔ Select `d:\MNIT\Projects\SIH\Practice1\frontend\android`.
3. Wait for Gradle sync to complete.
4. Go to **Build** ➔ **Generate Signed Bundle / APK...**
5. Select:
   * **Android App Bundle (AAB)** (for Google Play Store upload), OR
   * **APK** (for direct APK file installation on phone).
6. Create or select your release Keystore and click **Finish**.
7. The release output will be located in `frontend/android/app/release/`.

### Method 2: Command-Line Gradle Build
From the `frontend/android` directory:
```powershell
# Build Debug APK (for instant phone testing):
.\gradlew assembleDebug

# Build Unsigned Release APK:
.\gradlew assembleRelease
```
* **Debug APK Output**: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`
* **Release APK Output**: `frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 5. 🔄 Workflow for Future Frontend Updates to Android
Whenever you modify frontend React code:
```powershell
cd frontend
npm run build
npx cap sync android
```
This instantly copies and updates the compiled assets inside the Android Studio native project.
