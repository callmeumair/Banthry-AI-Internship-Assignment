# Conversational Browser Agent

A modular project to build a ChatGPT-style conversational browser agent using FastAPI (backend), Playwright (browser automation), WebSockets (real-time communication), and a React frontend.

## Features
- **FastAPI** backend for API and WebSocket communication
- **Playwright** for browser automation
- **WebSockets** for real-time chat
- **React** frontend mimicking ChatGPT chat UI

## Project Structure
```
backend/
  main.py           # FastAPI app, WebSocket endpoints
  browser_agent.py  # Playwright automation logic
frontend/
  (React app)
requirements.txt
README.md
.gitignore
```

## Setup Instructions

### 1. Backend
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install
cd backend
uvicorn main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

## Usage
- Open the frontend in your browser.
- Type messages to interact with the browser agent in real time.

## Notes
- Ensure Playwright browsers are installed (`playwright install`).
- WebSocket communication is used for real-time chat.
- The backend and frontend run separately.