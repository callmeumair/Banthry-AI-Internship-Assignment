from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from .websocket import router as ws_router
import os

app = FastAPI()

# Serve frontend static files
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

# Serve screenshots
app.mount("/screenshots", StaticFiles(directory="../screenshots"), name="screenshots")

templates = Jinja2Templates(directory="../frontend")

@app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# WebSocket router
app.include_router(ws_router) 