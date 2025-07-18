from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .browser import BrowserAgent
import asyncio
import json

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    agent = BrowserAgent()
    try:
        while True:
            data = await websocket.receive_text()
            try:
                # Step 1: Notify opening page
                await websocket.send_json({
                    "type": "status",
                    "message": "Opening page..."
                })
                title = await agent.goto(data)
                # Step 2: Notify capturing screenshot
                await websocket.send_json({
                    "type": "status",
                    "message": "Capturing screenshot..."
                })
                screenshot_path = await agent.screenshot()
                # Step 3: Send final reply with screenshot
                await websocket.send_json({
                    "type": "reply",
                    "message": f"Page loaded: {title}",
                    "screenshot": screenshot_path
                })
            except Exception as e:
                await websocket.send_json({
                    "type": "error",
                    "message": str(e)
                })
    except WebSocketDisconnect:
        await agent.close() 