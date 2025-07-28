"use client";
import React, { useState } from "react";
import Link from "next/link";

const PDFViewerHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const iframe = document.querySelector('iframe[title="PDF Viewer"]') as HTMLIFrameElement;
      if (iframe) {
        try {
          // For Google Docs viewer, we'll open the PDF in a new tab with search
          const currentUrl = iframe.src;
          // Google Docs viewer doesn't support direct search, so we'll open in new tab
          // and suggest using browser's find function (Ctrl+F)
          window.open(currentUrl, '_blank');
          
          // Show a helpful message to the user
          alert(`PDF opened in new tab. Use Ctrl+F (or Cmd+F on Mac) to search for: "${searchTerm}"`);
          
        } catch (error) {
          console.log('Search functionality may not be supported by this PDF viewer');
          // Fallback: just open the PDF
          const currentUrl = iframe.src;
          window.open(currentUrl, '_blank');
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h2 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-orange-600 transition-colors">
            Study PDF
          </h2>
        </Link>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            PDF file
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search PDF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            id="pdf-search-input"
          />
          <svg 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>
        <select className="px-2 py-1 text-sm border border-gray-300 rounded-md">
          <option>105%</option>
          <option>100%</option>
          <option>90%</option>
        </select>
      </div>
    </div>
  );
};

export default PDFViewerHeader; 