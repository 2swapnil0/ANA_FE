import React, { useEffect, useRef } from "react";
import { useStore } from "../api/store";
import { fetchMessages } from "../api/api.js";

const MessageContainer = () => {
  const messageContainerRef = useRef(null);
  const { messages, selectedProject, setMessages } = useStore((state) => ({
    messages: state.messages,
    selectedProject: state.selectedProject,
    setMessages: state.setMessages,
  }));

  useEffect(() => {
    async function loadMessages(projectName) {
      try {
        const fetchedMessages = await fetchMessages(projectName);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }

    if (selectedProject) {
      loadMessages(selectedProject);
    }
  }, [selectedProject, setMessages]);

  useEffect(() => {
    if (messages && messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="outer-container flex flex-col h-full">
      <div
        id="message-container"
        className="flex flex-col flex-1 gap-2 overflow-y-auto border-2 rounded-lg px-2 py-4"
        ref={messageContainerRef}
      >
        {messages && messages.length > 0 ? (
          <div className="flex flex-col px-2 divide-y-2">
            {messages.map((message, index) => (
              <div key={index} className="flex items-start px-2 py-4 gap-2">
                {message.from_ANA ? (
                  <img
                    src="/assets/ana.png"
                    alt="ANA's Avatar"
                    className="avatar rounded-full flex-shrink-0"
                  />
                ) : (
                  <img
                    src="/assets/user-avatar.png"
                    alt="User's Avatar"
                    className="avatar rounded-full flex-shrink-0"
                  />
                )}
                <div className="flex flex-col w-full text-left">
                  <p className="text-xs text-gray-400">
                    {message.from_ANA ? "ANA" : "You"}
                    <span className="timestamp">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </p>
                  {message.from_ANA && message.message.startsWith("{") ? (
                    <div
                      className="flex flex-col gap-5 w-full"
                      contentEditable="false"
                    >
                      <strong>Here's my step-by-step plan:</strong>
                      <div className="flex flex-col gap-3">
                        {Object.entries(JSON.parse(message.message)).map(
                          ([step, description], stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex gap-2 items-center"
                            >
                              <input
                                type="checkbox"
                                id={`step-${step}`}
                                disabled
                              />
                              <label htmlFor={`step-${step}`}>
                                <strong>Step {step}</strong>: {description}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : /https?:\/\/[^\s]+/.test(message.message) ? (
                    <div className="w-full" contentEditable="false">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: message.message.replace(
                            /(https?:\/\/[^\s]+)/g,
                            '<a href="$1" target="_blank" style="font-weight: bold; color: #03DAC6;">$1</a>'
                          ),
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full"
                      contentEditable="false"
                      dangerouslySetInnerHTML={{ __html: message.message }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span>No messages available</span>
        )}
      </div>
      <style>{`
        .outer-container {
          height: 75%; /* Adjust based on your layout needs */
        }
        .timestamp {
          margin-left: 8px;
          font-size: smaller;
          color: #aaa;
        }
        input[type="checkbox"] {
          appearance: none;
          width: 12px;
          height: 12px;
          border: 2px solid #03DAC6;
          border-radius: 4px;
          color: #03DAC6;
        }
        .avatar {
          width: 40px;
          height: 40px;
        }
        #message-container {
          border-color: #373737;
          background-color: #1E1E1E;
          color: #E0E0E0; /* Default text color for all text inside message container */
          overflow-y: scroll; /* Allow vertical scrolling */
        }
        /* Hide the scrollbar but keep the thumb visible */

        #message-container::-webkit-scrollbar {
          width: 5px; /* Make the scrollbar thumb narrower */
          background: transparent; 
          
        }
        #message-container::-webkit-scrollbar-thumb {
          background-color: grey;
          border-radius: 10px;
          min-height: 10%;
        }
      `}</style>
    </div>
  );
};

export default MessageContainer;
