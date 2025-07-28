import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-900/10 max-w-full",
                {
                  "bg-blue-600 text-white": message.role === "user",
                  "bg-white text-gray-900": message.role === "assistant",
                }
              )}
            >
              {message.role === "user" ? (
                <p className="text-white">{message.content}</p>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-lg font-bold text-gray-900 mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold text-gray-900 mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold text-gray-900 mb-1">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-700 mb-2">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                      em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                      code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-600">{children}</blockquote>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
