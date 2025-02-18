import React, { useEffect, useRef } from "react";
import Logic from "./logic";

const ChatScreen = () => {
  const { state, handleSendMessage, handleMessageChange } = Logic();
  const messagesEndRef = useRef(null);

  // Scroll to the last message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom on new message or when component loads
  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Handle "Enter" key press to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
      <div className="flex flex-col h-screen bg-background">
        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-4">
          <div className="space-y-4">
            {state.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                {/* Avatar */}
                {index % 2 === 0 ? (
                  <img
                    src="/avatar1.png"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full cursor-pointer mr-2"
                    onClick={() => console.log("Avatar clicked")}
                  />
                ) : (
                  <img
                    src="/avatar2.png"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full cursor-pointer ml-2"
                    onClick={() => console.log("Avatar clicked")}
                  />
                )}
                {/* Message Bubble */}
                <div
                  className={`${
                    index % 2 === 0
                      ? "bg-white text-textColor"
                      : "bg-primary text-white"
                  } rounded-lg p-3 max-w-xs shadow-md`}
                >
                  <div>{msg.text}</div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <footer className="bg-white p-4 border-t shadow">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={state.currentMessage}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSendMessage}
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition"
            >
              Send
            </button>
          </div>
        </footer>
      </div>
  );
};

export default ChatScreen;
