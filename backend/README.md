# Backend

This is the FastAPI backend for the Conversational Browser Agent.

## Setup

1. Create and activate a virtual environment (optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
3. Install Playwright browsers:
   ```bash
   playwright install
   ```

## Running the Server

Start the FastAPI server with Uvicorn:
```bash
uvicorn main:app --reload
```

The WebSocket endpoint will be available at ws://localhost:8000/ws/chat 

404: NOT_FOUND
Code: NOT_FOUND
ID: bom1::qhlpw-1752847113339-0ff27dd14e4d
```

on your Vercel deployment means that Vercel cannot find the page or API route you are trying to access. This is a common issue when deploying Python (FastAPI/Flask) backends or non-Next.js/React apps to Vercel, which is primarily designed for static sites and Node.js/Next.js backends.

### Why This Happens

- **Vercel is not designed to run Python servers like FastAPI or Flask** as persistent backend services.
- Vercel expects static files (HTML, JS, CSS) or Node.js serverless functions.
- Your FastAPI backend is not being started or routed by Vercel, so all requests return 404.

---

## How to Fix

### 1. **Deploy the Backend Separately**

- **Use a Python-friendly host** (e.g., [Render](https://render.com/), [Railway](https://railway.app/), [Fly.io](https://fly.io/), [Heroku](https://heroku.com/), or your own VPS) for your FastAPI backend.
- Deploy only the **frontend** (static files: `index.html`, `style.css`, `app.js`) to Vercel.

### 2. **How to Deploy the Frontend to Vercel**

- Move your frontend files (`index.html`, `style.css`, `app.js`) to the root or a `/public` directory.
- In your Vercel project settings, set the output directory to where your static files are.
- Vercel will serve these as a static site.

### 3. **How to Deploy the Backend**

- Push your FastAPI backend to a Python-friendly host.
- Make sure it is accessible via a public URL (e.g., `https://your-backend.onrender.com`).

### 4. **Update the Frontend WebSocket URL**

- In `app.js`, change:
  ```js
  const ws = new WebSocket('wss://your-backend.onrender.com/ws');
  ```
  (Use `wss://` for secure WebSocket if your backend is HTTPS.)

---

## Summary Table

| What to Deploy on Vercel | What to Deploy on Python Host |
|--------------------------|------------------------------|
| `index.html`, `style.css`, `app.js` | FastAPI backend (all Python code) |

---

## Example Deployment Flow

1. **Deploy FastAPI backend** to Render/Fly.io/Heroku.
2. **Deploy frontend** (static files) to Vercel.
3. **Update frontend** to point to the backend's public WebSocket URL.

---

## If You Want a Unified Deployment

- Use a platform that supports both Python and static files (e.g., [Render](https://render.com/), [Railway](https://railway.app/)), and serve the frontend from FastAPI itself.
- Or use Docker and deploy to a VPS or cloud provider.

---

### If you need step-by-step deployment instructions for Render, Railway, or another platform, let me know which one you prefer! 