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