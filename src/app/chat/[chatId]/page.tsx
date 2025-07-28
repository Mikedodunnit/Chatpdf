import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import PDFViewerHeader from "@/components/PDFViewerHeader";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import { currentUser } from "@clerk/nextjs";

type Props = {
  params: Promise<{
    chatId: string;
  }>;
};

const ChatPage = async (props: Props) => {
  const { params } = props;
  const { chatId } = await params;
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  
  const user = await currentUser();
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Chat List */}
      <div className="w-60 bg-white border-r border-gray-200">
        <ChatSideBar 
          chats={_chats} 
          chatId={parseInt(chatId)} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* PDF Viewer */}
        <div className="flex-[5] bg-white border-r border-gray-200 flex flex-col">
          {/* PDF Header */}
          <PDFViewerHeader />
          
          {/* PDF Content */}
          <div className="flex-1 overflow-hidden">
            <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-[3] bg-white border-l border-gray-200 flex flex-col">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
