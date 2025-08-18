# Cast Scheduler Pro

A professional Farcaster cast scheduling platform for scheduling and managing your Farcaster posts.

## Features

- **Cast Scheduling** - Schedule your Farcaster casts up to 30 days in advance
- **Bulk Upload** - Import multiple casts via CSV
- **Queue Management** - Manage your scheduled cast queue
- **Team Collaboration** - Work with your team on content planning
- **Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (for user data and cast storage)
- **Deployment**: Vercel ready

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file:
```bash
cp env.example .env
```

Edit `.env` with your Supabase credentials:
```env
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_KEY=your_supabase_anon_key_here
```

### 3. Start Development Server
```bash
npm start
```

### 4. Build for Production
```bash
npm run build
```

## Deployment

This app is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
│   ├── Dashboard.jsx   # Main dashboard view
│   ├── Scheduler.jsx   # Cast scheduling interface
│   ├── Queue.jsx       # Scheduled casts queue
│   ├── Team.jsx        # Team collaboration
│   └── Settings.jsx    # User settings
├── lib/                # Utility libraries
└── App.js              # Main app with routing
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
