# ChatPDF - AI-Powered PDF Chat Application

A modern, full-stack web application that allows users to upload PDF documents and chat with them using AI. Built with Next.js 14, TypeScript, and cutting-edge AI technologies.

## 🚀 Features

### 📄 PDF Processing & Storage
- **PDF Upload**: Drag-and-drop interface for easy PDF uploads
- **Cloud Storage**: Secure file storage using Supabase Storage
- **PDF Viewer**: Integrated Google Docs viewer for seamless PDF reading
- **Search Functionality**: Search within PDF documents with keyboard shortcuts

### 🤖 AI-Powered Chat
- **Contextual Responses**: AI generates responses based on PDF content
- **Smart Context Retrieval**: Advanced vector search using ChromaDB
- **Study-Focused Prompts**: Pre-defined queries for academic use:
  - Generate Summary
  - Important Points
  - Key Concepts
  - Short Notes
  - Main Ideas
  - Study Guide
  - Quick Review

### 💬 Chat Interface
- **Real-time Chat**: Instant AI responses with streaming
- **Markdown Rendering**: Beautifully formatted responses with:
  - Bold headlines and text
  - Bullet points and numbered lists
  - Code blocks and blockquotes
  - Professional typography
- **Chat History**: Persistent conversation history
- **Multiple Chats**: Manage multiple PDF conversations

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Clean, professional interface
- **Three-Column Layout**:
  - Chat sidebar with search and navigation
  - PDF viewer with controls
  - Chat interface with AI responses
- **Interactive Elements**: Hover effects and smooth transitions

### 🔐 Authentication & Security
- **Clerk Authentication**: Secure user authentication
- **User Management**: Individual chat histories per user
- **Protected Routes**: Secure access to user-specific content

### 📊 Database & Storage
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Reliable data storage
- **Vector Database**: ChromaDB for semantic search
- **Cloud Storage**: Supabase for file management

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form handling and validation
- **React Dropzone**: File upload interface
- **React Markdown**: Markdown rendering for chat responses
- **Lucide React**: Beautiful icons

### Backend & APIs
- **Next.js API Routes**: Server-side API endpoints
- **Google Gemini AI**: Advanced AI model for chat and embeddings
- **ChromaDB Cloud**: Vector database for semantic search
- **Supabase**: Cloud storage and database
- **Drizzle ORM**: Type-safe database queries

### AI & Machine Learning
- **Google Gemini 2.5 Flash**: Latest AI model for chat completion
- **Gemini Embeddings**: Vector embeddings for semantic search
- **Context Retrieval**: Smart document chunking and retrieval
- **Semantic Search**: Advanced similarity matching

### Database & Storage
- **PostgreSQL**: Primary database
- **Supabase Storage**: File storage for PDFs
- **ChromaDB Cloud**: Vector database for embeddings
- **Drizzle ORM**: Database schema and migrations

### Authentication & Security
- **Clerk**: User authentication and management
- **Row Level Security (RLS)**: Database security
- **Protected Routes**: Secure access control

### Development Tools
- **TypeScript**: Type safety and better DX
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Tailwind CSS**: Styling and design system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Supabase account
- ChromaDB Cloud account
- Google AI Studio account

### Environment Variables
Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your-postgresql-url"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-key"
CLERK_SECRET_KEY="your-clerk-secret"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_STORAGE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_STORAGE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME="your-bucket-name"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"

# Vector Database
CHROMA_API_KEY="your-chroma-api-key"
CHROMA_TENANT="your-chroma-tenant"
CHROMA_DATABASE="your-chroma-database"
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatpdf-yt-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx drizzle-kit push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
chatpdf-yt-main/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── chat/          # Chat API
│   │   │   ├── create-chat/   # Chat creation
│   │   │   └── get-messages/  # Message retrieval
│   │   ├── chat/[chatId]/     # Dynamic chat pages
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── ChatComponent.tsx  # Main chat interface
│   │   ├── ChatSideBar.tsx   # Chat navigation
│   │   ├── FileUpload.tsx    # PDF upload
│   │   ├── MessageList.tsx   # Message display
│   │   └── PDFViewer.tsx     # PDF viewer
│   └── lib/                  # Utility libraries
│       ├── db/              # Database configuration
│       ├── context.ts       # Context retrieval
│       ├── embeddings.ts    # AI embeddings
│       ├── pinecone.ts      # Vector database ops
│       └── s3.ts           # Storage operations
├── public/                  # Static assets
└── package.json            # Dependencies
```

## 🔧 Key Features Explained

### AI Context Retrieval
The application uses advanced semantic search to find relevant content from PDFs:
- **Text Chunking**: Documents are split into manageable chunks
- **Vector Embeddings**: Content is converted to numerical vectors
- **Semantic Search**: Queries are matched using similarity scores
- **Context Assembly**: Relevant chunks are combined for AI responses

### Chat Interface
Modern chat experience with:
- **Real-time Streaming**: Instant AI responses
- **Markdown Support**: Rich text formatting
- **Message Persistence**: Chat history saved to database
- **Multiple Conversations**: Switch between different PDFs

### PDF Processing
Comprehensive PDF handling:
- **Upload & Storage**: Secure cloud storage
- **Text Extraction**: Convert PDF to searchable text
- **Vector Indexing**: Create searchable embeddings
- **Viewer Integration**: Seamless PDF reading experience

## 🎯 Use Cases

### For Students
- **Study Aid**: Upload textbooks and ask questions
- **Note Taking**: Generate summaries and key points
- **Research**: Analyze academic papers and documents
- **Exam Prep**: Create study guides from course materials

### For Professionals
- **Document Analysis**: Extract insights from reports
- **Research**: Analyze industry papers and whitepapers
- **Knowledge Management**: Organize and search through documents
- **Quick Reference**: Find specific information in large documents

### For Researchers
- **Literature Review**: Analyze multiple papers
- **Data Extraction**: Find specific information across documents
- **Citation Support**: Get context for references
- **Collaboration**: Share insights from documents

## 🔮 Future Enhancements

- **Multi-language Support**: Support for multiple languages
- **Advanced Search**: Filters and advanced search options
- **Export Features**: Export chat conversations and summaries
- **Collaboration**: Share chats and documents with teams
- **Mobile App**: Native mobile application
- **API Integration**: RESTful API for third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Vector database by [ChromaDB](https://www.trychroma.com/)
- Storage by [Supabase](https://supabase.com/)
- Authentication by [Clerk](https://clerk.com/)

---

**ChatPDF** - Transform your PDFs into interactive conversations with AI.


