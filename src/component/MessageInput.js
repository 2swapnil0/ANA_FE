import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { executeAgent } from '../api/api';
import { useStore } from '../api/store';

const MessageInput = () => {
    const [messageInput, setMessageInput] = useState('');
    const { selectedProject, addMessage } = useStore((state) => ({
      selectedProject: state.selectedProject,
      addMessage: state.addMessage,
    }));

  const handleSendMessage = async () => {
        if (!messageInput.trim()) return;
    
        const userMessage = { from_ANA: false, message: messageInput, timestamp: new Date().toISOString() };
        addMessage(userMessage);
    
        try {
          const response = await executeAgent(messageInput, 'gpt-4', selectedProject);
    
          const anaMessage = { from_ANA: true, message: response.reply, timestamp: new Date().toISOString() };
          addMessage(anaMessage);
        } catch (error) {
          console.error('Error executing agent:', error);
        }
    
        setMessageInput(''); // Clear input after sending
      };

  return (
    <div className="input-container relative border-2 rounded-lg overflow-hidden" style={{ borderColor: '#373737', backgroundColor: '#1E1E1E' }}>
      <textarea
        id="message-input"
        className="w-full p-2 pl-10 pr-16 text-gray-200 placeholder-gray-400 border-none"
        placeholder="Type your message..."
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      ></textarea>
      <button
        id="send-message-btn"
        className="absolute right-4 bottom-4 text-white rounded-md p-1.5"
        onClick={handleSendMessage}
        style={{ backgroundColor: '#03DAC6' }}
      >
        <i className="fas fa-paper-plane"></i>
      </button>
    </div>
  );
};

export default MessageInput;

// External CSS styles (placed at the end of your component file)
const styles = `
.input-container {
  position: relative;
}

.input-container textarea {
  min-height: 60px;
  max-height: 120px;
  resize: none;
  padding-right: 40px; /* Make room for the send button */
  background-color: #1E1E1E; /* Secondary Background */
  overflow-y: scroll; /* Allow vertical scrolling */
  scrollbar-width: none; /* For Firefox */
}

.input-container textarea::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

.input-container .token-count {
  position: absolute;
  left: 16px;
  bottom: 12px;
}

.input-container {
  border-color: #373737;
  background-color: #1E1E1E;
}

.send-btn {
  background-color: #03DAC6;
}
`;

// Use a style tag to inject the CSS into the document head
const styleTag = document.createElement('style');
styleTag.type = 'text/css';
styleTag.appendChild(document.createTextNode(styles));
document.head.appendChild(styleTag);


