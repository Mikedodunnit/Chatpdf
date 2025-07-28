"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send, Mic } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages, setInput } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const predefinedQueries = [
    {
      label: "Generate Summary",
      prompt: "Please provide a comprehensive summary of this study material, covering all main topics and key information."
    },
    {
      label: "Important Points",
      prompt: "Extract and list the most important points, facts, and key information from this study material."
    },
    {
      label: "Key Concepts",
      prompt: "Identify and explain the main concepts, theories, and fundamental ideas presented in this material."
    },
    {
      label: "Short Notes",
      prompt: "Create concise, bullet-pointed notes that capture the essential information for quick reference."
    },
    {
      label: "Main Ideas",
      prompt: "What are the central themes and main ideas discussed in this study material?"
    },
    {
      label: "Study Guide",
      prompt: "Create a structured study guide with organized sections, key points, and important details for exam preparation."
    },
    {
      label: "Quick Review",
      prompt: "Provide a brief overview and quick review of the main topics covered in this material."
    }
  ];

  const handlePredefinedQuery = (query: any) => {
    setInput(query.prompt);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h3 className="text-lg font-semibold text-gray-900">Study Assistant</h3>
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Pre-defined Query Buttons */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2 mb-3">
          {predefinedQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => handlePredefinedQuery(query)}
              className="px-4 py-2 text-sm bg-white text-gray-700 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              {query.label}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          <button 
            onClick={() => setInput("Create detailed study notes with bullet points and key highlights from this material.")}
            className="text-orange-500 hover:text-orange-600 hover:underline"
          >
            Create study notes
          </button>
          , 
          <button 
            onClick={() => setInput("Highlight and explain the most important concepts and key takeaways from this material.")}
            className="text-orange-500 hover:text-orange-600 hover:underline"
          >
            highlight key concepts
          </button>
          , and 
          <button 
            onClick={() => setInput("Provide quick explanations and simplified explanations of complex topics in this material.")}
            className="text-orange-500 hover:text-orange-600 hover:underline"
          >
            get quick explanations
          </button>
          <button className="text-orange-500 hover:text-orange-600 ml-1">+8 more</button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto" id="message-container">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask any question..."
              className="flex-1"
            />
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
        
        {/* High Quality Toggle */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="high-quality"
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="high-quality" className="text-sm text-gray-600">
              High Quality
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
