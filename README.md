# 🧠 NeuraNotes

An intelligent note-taking app with AI-powered features. Create, organize, and enhance your notes with ease.

## ✨ Features

-   Rich text editor
-   AI-powered summarization, expansion, and tag generation
-   Folder and tag-based organization

## 🚀 Quick Start

### Prerequisites

-   Node.js (v16+)
-   MongoDB

### Installation

```bash
git clone <repository-url>
cd AI_Notes_CRUD
cd server
npm install
cp .env.example .env # Configure .env with your MongoDB URI and Gemini API key
npm run init-db
npm run dev # Start the server
```
### In a new terminal:
```bash
cd ../client/my-project
npm install
npm run dev # Start the client
```
Open your browser to http://localhost:5173.

###📂Project Structure
```bash
AI_Notes_CRUD/
├── server/         # Backend API (Node.js, Express, MongoDB)
├── client/my-project/   # Frontend (React, Vite, Tailwind CSS)
└──
```
