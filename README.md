# 🧠 NeuraNotes

Your intelligent note-taking companion with AI-powered features.

## ✨ Features

- **Smart Note Creation**: Rich text editor with modern UI
- **Voice Recording**: Built-in microphone support for voice notes
- **AI Integration**: Automatic summarization, expansion, and tag generation
- **Organized Storage**: Folder and tag-based organization
- **Modern Design**: Clean, distraction-free interface
- **Real-time Search**: Fast note discovery and filtering

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Modern web browser with microphone support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI_Notes_CRUD
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client/my-project
   npm install
   ```

4. **Configure environment variables**
   ```bash
   cd ../server
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/neura_notes
   JWT_SECRET=your_super_secret_jwt_key_2024
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Initialize database**
   ```bash
   npm run init-db
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

7. **Start the client** (in a new terminal)
   ```bash
   cd ../client/my-project
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### MongoDB Setup

- **Local MongoDB**: Install MongoDB Community Edition
- **Cloud MongoDB**: Use MongoDB Atlas (free tier available)

### Gemini AI API

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

## 🎯 Usage

### Creating Notes
1. Click "New Note" button
2. Enter title and content
3. Add tags and select folder
4. Use voice recording for audio notes
5. Click "Save Note"

### AI Features
- **Summarize**: Get AI-generated summaries
- **Expand**: Enhance notes with AI suggestions
- **Generate Tags**: Automatic tag suggestions

### Organization
- Use folders to categorize notes
- Add tags for better searchability
- Pin important notes
- Archive old notes

## 🐛 Troubleshooting

### Common Issues

**Voice Recording Not Working**
- Ensure microphone permissions are granted
- Use HTTPS in production (required for media devices)
- Check browser compatibility (Chrome, Firefox, Safari)

**Database Connection Issues**
- Verify MongoDB is running
- Check connection string in `.env`
- Run `npm run init-db` to initialize database

**AI Features Not Working**
- Verify Gemini API key is set
- Check internet connection
- Ensure note content is not empty

**Notes Not Saving**
- Check server is running on port 5000
- Verify database connection
- Check browser console for errors

### Error Messages

- **"MongoDB connection error"**: Database not accessible
- **"Network error"**: Client-server communication issue
- **"Unauthorized"**: Authentication token expired

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI**: Google Gemini API
- **Authentication**: JWT tokens

## 📁 Project Structure

```
AI_Notes_CRUD/
├── server/                 # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth middleware
│   └── index.js          # Server entry point
├── client/my-project/     # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api/          # API client functions
│   │   └── App.jsx       # Main app component
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review browser console for errors
3. Check server logs for backend issues
4. Create an issue with detailed error information

## 🔄 Updates

- **v1.0.0**: Initial release with core features
- **v1.1.0**: Enhanced voice recording and error handling
- **v1.2.0**: Improved AI integration and performance

---

**Made with ❤️ for better note-taking**
