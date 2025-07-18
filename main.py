from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "FastAPI is working!"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Echo: {data}") 