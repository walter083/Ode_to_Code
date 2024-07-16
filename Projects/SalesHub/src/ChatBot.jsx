import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaPaperPlane } from 'react-icons/fa';
import './ChatBot.css';
import axios from 'axios';
import { db, auth } from './firebase.js';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';

const API_ENDPOINT = 'https://cloud.olakrutrim.com/v1/chat/completions';
const API_KEY = "_rKv0bbBq5~KZrccG.Z_TtyJVRI";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      loadMessagesFromFirestore();
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessagesFromFirestore = async () => {
    if (auth.currentUser) {
      const messagesRef = collection(db, `users/${auth.currentUser.uid}/messages`);
      const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      const loadedMessages = [];
      querySnapshot.forEach((doc) => {
        loadedMessages.push(doc.data());
      });
      setMessages(loadedMessages.reverse());
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const createSystemMessage = () => {
    return `You are Sara, an AI sales assistant for our website. Here are some key details about our company and products:
      - Company Name: SalesHub
      - Main Products: Sales Assistant
      - Special Features: [Include any special features you offer]
      - Current Promotions: [List any ongoing promotions]
      - Return Policy: 30 Days
      - Shipping Information: Kerala,India
      - Contact Information: example.com
      Always introduce yourself as Sara when asked. Be helpful, friendly, and knowledgeable about our products and services. If you don't know something, politely say so and offer to connect the customer with a human representative.
      When you are giving responses, they should be crisp and clear and should not be in huge paragraphs. Additionally, any unrelated questions should not be answered. Also, give some suggestions for users to ask.
      How to make appointments?

      Goto appointment page select role, date, select time select your employee name schedule appointment`;
  };

  const chatWithSara = async (userMessage) => {
    try {
      const response = await axios.post(API_ENDPOINT, {
        model: "Krutrim-spectre-v2",
        messages: [
          {
            role: "system",
            content: createSystemMessage()
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        frequency_penalty: 0,
        logit_bias: {2435: -100, 640: -100},
        max_tokens: 256,
        n: 1,
        presence_penalty: 0,
        response_format: { type: "text" },
        stop: null,
        stream: false,
        temperature: 0.7,
        top_p: 1
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error chatting with Sara:', error);
      return "I'm sorry, but I'm having trouble connecting right now. Please try again later or contact our customer support.";
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      const userMessage = { text: input, sender: 'user', timestamp: Date.now() };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');

      setIsTyping(true);
      const botResponse = await chatWithSara(input);
      setIsTyping(false);

      const botMessage = { text: botResponse, sender: 'bot', timestamp: Date.now() };
      setMessages(prevMessages => [...prevMessages, botMessage]);

      if (auth.currentUser) {
        const messagesRef = collection(db, `users/${auth.currentUser.uid}/messages`);
        await addDoc(messagesRef, userMessage);
        await addDoc(messagesRef, botMessage);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-bot">
      {isOpen ? (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <h3>Sara</h3>
              <span className="online-status">online</span>
            </div>
            <button onClick={toggleChat} className="close-btn">×</button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <span className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? (
                <div className="loading-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={toggleChat} className="chat-button">
          <FaComments />
        </button>
      )}
    </div>
  );
};

export default ChatBot;