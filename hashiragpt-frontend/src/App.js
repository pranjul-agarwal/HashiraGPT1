import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { type: "user", text: message }];
    setChat(newChat);
    setMessage("");

    try {
      const res = await axios.post("https://hashiragpt1.onrender.com/api/content", { question: message });
      setChat([...newChat, { type: "bot", text: res.data.result }]);
    } catch (error) {
      console.error("Error:", error);
      setChat([...newChat, { type: "bot", text: "Error getting response." }]);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>HashiraGPT</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto" }}>
        {chat.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.type === "user" ? "right" : "left" }}>
            <strong>{msg.type === "user" ? "You" : "HashiraGPT"}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ width: "80%", padding: "8px", marginTop: "10px" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "8px" }}>Send</button>
    </div>
  );
}

export default App;
