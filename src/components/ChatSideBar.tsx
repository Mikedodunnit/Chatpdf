"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredChats = chats.filter(chat => 
    chat.pdfName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-white text-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">ChatPDF</h2>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Link href="/">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0">
            <PlusCircle className="mr-2 w-4 h-4" />
            New Chat
          </Button>
        </Link>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="text-sm text-gray-500 mb-2 px-2">Recent Chats</div>
        <div className="space-y-1">
          {filteredChats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div
                className={cn(
                  "rounded-lg p-3 text-gray-700 flex items-center cursor-pointer transition-colors",
                  {
                    "bg-blue-500 text-white": chat.id === chatId,
                    "hover:bg-gray-100 hover:text-gray-900": chat.id !== chatId,
                  }
                )}
              >
                <MessageCircle className="mr-3 w-4 h-4 flex-shrink-0" />
                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                  {chat.pdfName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ChatSideBar;
