import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from './config';

function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🌱 Hello! I'm your Environmental Activist AI assistant. I'm here to help you with waste management, cleanliness tips, and environmental awareness. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are an enthusiastic environmental activist AI assistant focused on waste management, cleanliness, and environmental consciousness. 
      
      Your personality:
      - Passionate about environmental protection
      - Always promote proper waste disposal and recycling
      - Encourage cleanliness and hygiene
      - Use emojis and positive language
      - Give practical, actionable advice
      - Be motivational and inspiring
      
      User's message: ${inputMessage}
      
      Respond as an environmental activist would, focusing on waste management, cleanliness, and environmental protection. Keep responses concise but engaging.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const assistantMessage = {
        role: 'assistant',
        content: text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage = {
        role: 'assistant',
        content: "🌱 I'm sorry, I'm having trouble connecting right now. But remember - every small action counts for our planet! Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    "How can I reduce waste?",
    "What should I recycle?",
    "Tips for cleanliness",
    "Environmental facts",
    "Bin management help"
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '600px',
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      border: '1px solid rgba(52, 199, 89, 0.2)'
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--gradient-primary)',
        color: 'var(--white)',
        padding: 'var(--space-lg)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div style={{ fontSize: 'var(--font-size-lg)' }}>🌱</div>
          <div>
            <div style={{ fontWeight: '600' }}>Eco Assistant</div>
            <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>Environmental Activist AI</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--white)',
            fontSize: 'var(--font-size-lg)',
            cursor: 'pointer',
            padding: 'var(--space-xs)',
            borderRadius: 'var(--radius-sm)',
            transition: 'background var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'none'}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 'var(--space-sm)'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                background: message.role === 'user' 
                  ? 'var(--gradient-primary)' 
                  : 'var(--light-gray)',
                color: message.role === 'user' 
                  ? 'var(--white)' 
                  : 'var(--text-primary)',
                fontSize: 'var(--font-size-sm)',
                lineHeight: '1.5',
                wordWrap: 'break-word'
              }}
            >
              {message.content}
              <div style={{
                fontSize: 'var(--font-size-xs)',
                opacity: 0.7,
                marginTop: 'var(--space-xs)',
                textAlign: 'right'
              }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: 'var(--space-sm)'
          }}>
            <div style={{
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--light-gray)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid var(--primary-green)',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Thinking...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div style={{
        padding: 'var(--space-sm) var(--space-md)',
        borderTop: '1px solid var(--light-gray)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-xs)'
      }}>
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => setInputMessage(action)}
            style={{
              background: 'var(--light-green)',
              border: '1px solid var(--primary-green)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-xs) var(--space-sm)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--primary-green)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--primary-green)';
              e.target.style.color = 'var(--white)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--light-green)';
              e.target.style.color = 'var(--primary-green)';
            }}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: 'var(--space-md)',
        borderTop: '1px solid var(--light-gray)',
        display: 'flex',
        gap: 'var(--space-sm)'
      }}>
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about waste management, cleanliness, or environment..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid var(--light-gray)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            outline: 'none',
            transition: 'border-color var(--transition-fast)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary-green)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--light-gray)'}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="btn btn-primary"
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: 'var(--font-size-sm)',
            opacity: (!inputMessage.trim() || isLoading) ? 0.5 : 1,
            cursor: (!inputMessage.trim() || isLoading) ? 'not-allowed' : 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
