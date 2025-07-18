# Conversational Browser Agent

## Architecture

```mermaid
---
graph TD;
  subgraph Frontend
    A1["User Chat UI (HTML/JS)"]
    A2["WebSocket Client"]
  end
  subgraph Backend
    B1["FastAPI Server"]
    B2["NLU & Slot Filling"]
    B3["GmailAgent (Playwright)"]
    B4["Email Content Generator (OpenAI)"]
    B5["WebSocket Endpoint"]
  end
  subgraph Gmail
    C1["Gmail Web Interface"]
  end
  A1--User Message-->A2
  A2--WebSocket-->B5
  B5--Route Message-->B2
  B2--Intent/Slots-->B3
  B2--Intent/Slots-->B4
  B3--Browser Automation-->C1
  B3--Screenshots/Status-->B5
  B5--Reply/Screenshots-->A2
  A2--Update UI-->A1
```

## How to Install and Run

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd agent_project
   ```
2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   playwright install
   ```
3. **Start the backend:**
   ```bash
   uvicorn backend.main:app --reload
   ```
4. **Open the frontend:**
   - Go to [http://localhost:8000](http://localhost:8000) in your browser.

## Tools and Libraries Used

- **FastAPI**: High-performance Python web framework for serving the backend and WebSocket API.
- **Playwright**: For browser automation, mimicking real user actions in Gmail (not using Gmail APIs).
- **OpenAI GPT**: For generating professional email content based on user context and tone.
- **HTML/JS/CSS**: Simple, responsive frontend chat interface styled like ChatGPT.
- **WebSockets**: Real-time, bi-directional communication between frontend and backend for chat and status updates.

## Screenshots / GIFs

> _Add your screenshots or GIFs here after running the full pipeline!_

- ![Chat UI Example](screenshots/chat_ui_example.png)
- ![Gmail Login Step](screenshots/gmail_login_example.png)
- ![Email Compose Step](screenshots/gmail_compose_example.png)
- ![Email Sent Step](screenshots/gmail_sent_example.png)

## Challenges Faced & Solutions

- **Slot Filling & Clarification**: Handling incomplete user commands required a robust NLU and slot-filling loop. Solved by combining regex-based extraction with fallback clarifying questions.
- **Browser Automation Reliability**: Gmail's UI changes and anti-bot measures can break automation. Used Playwright's robust selectors, slow_mo, and proper waits to mimic human behavior.
- **Security**: Never store or log real credentials. Always use a test Gmail account for automation.
- **Real-time Feedback**: Ensured the user sees step-wise status updates and screenshots by sending incremental WebSocket messages.
- **Email Content Quality**: Used OpenAI GPT for natural, professional email generation, with fallback templates if the API is unavailable.

## Important Note

**This project uses browser automation (Playwright) to interact with Gmail, NOT the Gmail APIs.** This approach mimics real user actions in the browser for maximum flexibility and demonstration value. 