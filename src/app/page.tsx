import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn, FileText, PenTool, FolderOpen, Languages, StickyNote, Quote } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="w-screen min-h-screen bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-gray-800">ChatPDF</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl font-semibold text-gray-900 mb-6">
            Chat with any PDF
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join millions of students, researchers and professionals to instantly
            answer questions and understand research with AI
          </p>

          <div className="mb-8">
            {isAuth ? (
              <div className="space-y-4">
                <FileUpload />
                {firstChat && (
                  <Link href={`/chat/${firstChat.id}`}>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Go to Chats <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why students & researchers use ChatPDF?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Citation backed answers */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Quote className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Citation backed answers</h3>
              </div>
              <p className="text-gray-600">
                Get answers backed by citations from specific sections of the PDF
              </p>
            </div>

            {/* Paper summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Paper summary</h3>
              </div>
              <p className="text-gray-600">
                Get detailed section-wise summary for your PDF file
              </p>
            </div>

            {/* Highlighted text explanations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <PenTool className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Highlighted text explanations</h3>
              </div>
              <p className="text-gray-600">
                Understand complex text in the PDF to get simplified explanations
              </p>
            </div>

            {/* Get related papers */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <FolderOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Get related papers</h3>
              </div>
              <p className="text-gray-600">
                Get paper recommendations similar to the highlighted text in PDF
              </p>
            </div>

            {/* Language support */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Languages className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Language support</h3>
              </div>
              <p className="text-gray-600">
                Supports 75+ languages, making it accessible for users worldwide
              </p>
            </div>

            {/* Note taking */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <StickyNote className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Note taking</h3>
              </div>
              <p className="text-gray-600">
                Take notes to retain and organize information from your readings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-white py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900">
          Your search for the best tool ends here
        </h2>
      </div>
    </div>
  );
}