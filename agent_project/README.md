# Conversational Browser Agent

A modular project to build a ChatGPT-style conversational browser agent with:
- FastAPI backend (serves frontend, WebSocket for real-time updates)
- Playwright for browser automation
- Simple HTML/JS frontend (served by backend)
- Real-time screenshot and status updates

## Project Structure
```
/agent_project
  /backend
    __init__.py
    main.py
    nlu.py
    browser.py
    generator.py
    websocket.py
    utils.py
  /frontend
    index.html
    style.css
    app.js
  /screenshots
  /tests
README.md
requirements.txt
```

## Setup
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   playwright install
   ```
2. Run the backend:
   ```bash
   uvicorn backend.main:app --reload
   ```
3. Open [http://localhost:8000](http://localhost:8000) in your browser.

## Features
- Chat with the browser agent
- Real-time screenshots and status via WebSocket
- All static files served from backend 