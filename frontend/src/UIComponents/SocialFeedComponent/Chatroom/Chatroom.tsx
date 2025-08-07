import React, { useState } from "react";

interface ChatMessage {
    text: string;
    isUser: boolean;
    timestamp: string;
}

const Chatroom: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    const generateChat = async (message: string) => {

        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const result = await response.json();

            //user message + AI response as chat history
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    text: message,
                    isUser: true,
                    timestamp: new Date().toISOString()
                },
                {
                    text: result.response,
                    isUser: false,
                    timestamp: result.timestamp
                }
            ]);

        } catch (error) {
            console.error('Error:', error)

        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            generateChat(newMessage);
            setNewMessage('');
        }
    }


    return (
        <div className="chatroom-wrapper">
            <h2>Chatroom</h2>
            <div className="chat-history">
                {
                    messages.map((message, index) => {
                        return <div
                            key={index}
                            className={`chat-message ${message.isUser ? 'user-message' : 'ai-message'}`}
                        >
                            <div className="message-content">{message.text}</div>
                            <div className="message-timestamp">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>

                        </div>
                    })
                }
            </div>
            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    )
}

export default Chatroom;