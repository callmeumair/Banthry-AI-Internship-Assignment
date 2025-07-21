"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface Message {
  sender: "agent";
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("Disconnected");
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/events");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => setStatus("Connected");
    eventSource.onerror = () => setStatus("Disconnected");
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "agent",
            text: data.message,
            timestamp: new Date().toLocaleString(),
          },
        ]);
      } catch {}
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.status}>
        Status: <span>{status}</span>
      </div>
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} className={styles.bubble + " " + styles.agent}>
            <div>{msg.text}</div>
            <div className={styles.timestamp}>{msg.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
