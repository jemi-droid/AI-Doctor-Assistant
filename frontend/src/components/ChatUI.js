import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatUI.css";

function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Welcome to AI Doctor Assistant.\nDescribe your symptoms to receive a preliminary prediction.",
        time: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedSymptoms = [
    "fever cough fatigue",
    "skin rash itching",
    "headache nausea",
    "chest pain dizziness",
  ];

  const sendMessage = async (customInput = null) => {
    const finalInput = customInput || input;

    if (!finalInput.trim()) return;

    const userMessage = {
      sender: "user",
      text: finalInput,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        symptoms: finalInput,
      });

      let botText = "";

      if (response.data.error) {
        botText =
          "⚠️ I could not recognize the symptoms you entered.\n\nPlease enter valid medical symptoms like:\n• fever\n• cough\n• headache\n• fatigue";
      } else {
        botText = `🩺 Predicted Disease:\n${response.data.predicted_disease}\n\n📊 Confidence Score: ${response.data.confidence}%\n\n⚠️ This is an AI-generated prediction and not a medical diagnosis.`;
      }

      const botMessage = {
        sender: "bot",
        text: botText,
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      const botMessage = {
        sender: "bot",
        text: "⚠️ Unable to connect to backend server.",
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "🧠 New chat started.\nDescribe your symptoms.",
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>🧠 AI Doctor</h2>

        <button className="new-chat-btn" onClick={clearChat}>
          + New Chat
        </button>

        <div className="suggestions">
          <h4>Suggested Symptoms</h4>

          {suggestedSymptoms.map((symptom, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => sendMessage(symptom)}
            >
              {symptom}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="chat-container">
        <div className="chat-header">
          AI Doctor Assistant
        </div>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div>{msg.text}</div>
              <small>{msg.time}</small>
            </div>
          ))}

          {loading && (
            <div className="message bot typing">
              <div className="typing-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Describe your symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button onClick={() => sendMessage()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatUI;