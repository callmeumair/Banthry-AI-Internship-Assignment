from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .browser import BrowserAgent
import asyncio

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    agent = BrowserAgent()
    try:
        while True:
            data = await websocket.receive_text()
            # Assume the message is a URL
            try:
                title = await agent.goto(data)
                screenshot_path = await agent.screenshot()
                await websocket.send_json({
                    "status": "ok",
                    "title": title,
                    "screenshot": screenshot_path
                })
            except Exception as e:
                await websocket.send_json({"status": "error", "error": str(e)})
    except WebSocketDisconnect:
        await agent.close() 