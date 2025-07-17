from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from backend.browser_agent import BrowserAgent
import asyncio

app = FastAPI()

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    agent = BrowserAgent()
    try:
        while True:
            data = await websocket.receive_text()
            # Assume the message is a URL
            try:
                title = await agent.goto(data)
                await websocket.send_text(f"Page title: {title}")
            except Exception as e:
                await websocket.send_text(f"Error: {str(e)}")
    except WebSocketDisconnect:
        await agent.close() 