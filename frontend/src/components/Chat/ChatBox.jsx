import { useState, useEffect, useRef } from "react";
import { fetchChats, postChat } from "../../api/chatApi";
import { sendMessage, subscribeToMessage } from "../../sockets/chatClient";
import Message from "./Message";

export default function ChatBox({ projectId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats(projectId).then(setMessages).catch(console.error);

    const unsubscribe = subscribeToMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return unsubscribe;
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const savedMessage = await postChat(projectId, input);

      sendMessage(projectId, savedMessage);

      setMessages((prev) => [...prev, savedMessage]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-xl shadow bg-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.length > 0 ? (
          messages.map((m) => (
            <Message key={m._id} message={m} currentUser={currentUser} />
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center mt-10 italic">
            No messages yet — start the conversation!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-3 border-t border-gray-200 bg-gray-50"
      >
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800 placeholder-gray-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        >
          Send
        </button>
      </form>
    </div>
  );
}
