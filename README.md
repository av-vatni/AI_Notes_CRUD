# 🧠 AI-Powered Notes App

A modern, intelligent note-taking application built with React, Node.js, and MongoDB. Features rich text editing, AI-powered enhancements, voice notes, and comprehensive organization tools.

## ✨ Features

### 🌱 Phase 1: Project Setup ✅
- **Modern Tech Stack**: React 19 + Vite + Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful UI
- **GitHub Integration**: Ready for version control

### ✍️ Phase 2: Enhanced Notes CRUD ✅
- **Rich Text Editor**: React Quill with formatting options
- **Advanced Note Management**: Create, read, update, delete notes
- **Real-time Updates**: Instant synchronization

### 📁 Phase 3: Organization & Search ✅
- **Tags System**: Organize notes with custom tags
- **Folder Organization**: Categorize notes by folders
- **Advanced Search**: Full-text search across titles and content
- **Filtering & Sorting**: Multiple sorting options and filters
- **Pin & Archive**: Pin important notes, archive old ones

### 🤖 Phase 4: AI Integration ✅
- **AI Summarization**: Generate summaries for notes
- **Content Expansion**: AI-powered note enhancement
- **Smart Tag Generation**: Automatic tag suggestions
- **Intelligent Organization**: AI-assisted categorization

### 🎤 Phase 5: Voice-to-Text ✅
- **Voice Recording**: Built-in microphone support
- **Audio Notes**: Record and save voice notes
- **Web Speech API**: Modern browser speech recognition

### 🔐 Phase 6: Authentication ✅
- **User Registration & Login**: Secure user accounts
- **JWT Authentication**: Token-based security
- **Password Hashing**: bcrypt security
- **Protected Routes**: Secure note access

### 📦 Phase 7: Final Touches ✅
- **Modern UI/UX**: Beautiful, responsive design
- **Mobile Optimization**: Touch-friendly interface
- **Performance**: Optimized for speed
- **Accessibility**: Screen reader friendly

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd AI_Notes_CRUD
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client/my-project
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/ai_notes
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

### 5. Run the Application

#### Backend (Terminal 1)
```bash
cd server
npm run dev
```

#### Frontend (Terminal 2)
```bash
cd client/my-project
npm run dev
```

### 6. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🏗️ Project Structure

```
AI_Notes_CRUD/
├── server/                 # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API endpoints
│   ├── middleware/        # Authentication middleware
│   └── index.js           # Server entry point
├── client/my-project/     # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/           # API client functions
│   │   └── App.jsx        # Main application
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/toggle-pin` - Toggle pin status
- `PATCH /api/notes/:id/toggle-archive` - Toggle archive status

### AI Features
- `POST /api/ai/summary/:noteId` - Generate AI summary
- `POST /api/ai/expand/:noteId` - Expand note content
- `POST /api/ai/generate-tags/:noteId` - Generate tags

## 🎨 UI Components

- **NoteEditor**: Rich text editor with advanced options
- **NotesList**: Grid view with search and filtering
- **Auth**: Login/register modal
- **Responsive Layout**: Sidebar navigation and mobile menu

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly interface
- Responsive grid layouts
- Collapsible sidebar

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
cd server
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
cd client/my-project
npm run build
# Deploy dist/ folder
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React Quill for rich text editing
- Tailwind CSS for styling
- Lucide React for icons
- MongoDB for database
- OpenAI for AI features (when integrated)

## 🔮 Future Enhancements

- Real-time collaboration
- Advanced AI features with OpenAI
- Mobile app (React Native)
- Cloud storage integration
- Advanced analytics and insights
- Multi-language support
- Dark mode theme
- Export/import functionality

---

**Built with ❤️ using modern web technologies**
