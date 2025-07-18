"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface Message {
  sender: "user" | "agent";
  type: "text" | "screenshot";
  text?: string;
  screenshot?: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");
    ws.current.onopen = () => {
      addAgentMessage("Connected to browser agent.");
    };
    ws.current.onclose = () => {
      addAgentMessage("Disconnected.");
    };
    ws.current.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        addAgentMessage(event.data);
        return;
      }
      if (data.type === "status" || data.type === "reply") {
        addAgentMessage(data.message);
        if (data.screenshot) {
          addAgentScreenshot(data.screenshot, data.message);
        }
      } else if (data.type === "error") {
        addAgentMessage("Error: " + data.message);
      }
    };
    return () => {
      ws.current?.close();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addUserMessage(text: string) {
    setMessages((msgs) => [
      ...msgs,
      {
        sender: "user",
        type: "text",
        text,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  }

  function addAgentMessage(text: string) {
    setMessages((msgs) => [
      ...msgs,
      {
        sender: "agent",
        type: "text",
        text,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  }

  function addAgentScreenshot(screenshot: string, caption?: string) {
    setMessages((msgs) => [
      ...msgs,
      {
        sender: "agent",
        type: "screenshot",
        text: caption,
        screenshot,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  }

  function handleSend() {
    if (input.trim() && ws.current?.readyState === 1) {
      addUserMessage(input);
      ws.current.send(input);
      setInput("");
    }
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, i) =>
          msg.type === "text" ? (
            <div
              key={i}
              className={
                styles.bubble +
                " " +
                (msg.sender === "user" ? styles.user : styles.agent)
              }
            >
              <div>{msg.text}</div>
              <div className={styles.timestamp}>{msg.timestamp}</div>
            </div>
          ) : (
            <div key={i} className={styles.screenshotBubble}>
              {msg.text && <div>{msg.text}</div>}
              <img
                src={msg.screenshot + "?" + Date.now()}
                alt="Screenshot"
                className={styles.screenshotThumb}
              />
              <div className={styles.timestamp}>{msg.timestamp}</div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Type your command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className={styles.send} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
