# Frontend

This is a simple HTML/JS frontend for the Conversational Browser Agent.

## Running the Frontend

You can serve this directory using any static file server. For example, with Python 3:

```bash
cd frontend
python3 -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Features
- ChatGPT-style chat UI
- Connects to backend WebSocket at ws://localhost:8000/ws/chat 