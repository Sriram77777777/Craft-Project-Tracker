# Craft Hub - Personal Craft Project Tracker

A full-stack web application for tracking personal craft projects such as knitting, quilting, sewing, and other creative endeavors. Built with Next.js, MongoDB, and NextAuth.js.

## Features

- **User Authentication**: Secure email/password authentication with NextAuth.js
- **Project Management**: Create, edit, delete, and track craft projects
- **Progress Tracking**: Visual progress bars and completion percentages
- **Supply Inventory**: Manage your craft supplies with categories and quantities
- **Task Management**: Add and track tasks for each project
- **Filtering & Search**: Filter projects by status, importance, and search functionality
- **Responsive Design**: Mobile-friendly interface with sidebar navigation
- **Real-time Updates**: Optimistic updates for smooth user experience

## Tech Stack

- **Frontend**: Next.js 15, React 19, CSS Modules
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Plain CSS Modules (no external CSS frameworks)
- **Database**: MongoDB with Mongoose ODM

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd craft-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```
   MONGODB_URI=mongodb://localhost:27017/craft-hub
   NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas for cloud hosting.

5. **Seed the database (optional)**
   
   Populate with sample data:
   ```bash
   npm run seed
   ```
   
   This creates a demo user:
   - Email: `demo@example.com`
   - Password: `password123`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
craft-hub/
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth configuration
│   │   ├── projects/        # Project CRUD operations
│   │   ├── supplies/        # Supply CRUD operations
│   │   └── register/        # User registration
│   ├── components/          # Reusable React components
│   ├── dashboard/           # Protected dashboard pages
│   │   ├── projects/        # Project management pages
│   │   └── supplies/        # Supply management pages
│   ├── login/              # Authentication pages
│   ├── register/           
│   ├── globals.css         # Global styles
│   ├── layout.js           # Root layout
│   └── page.js             # Home page
├── lib/
│   └── mongodb.js          # Database connection
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Project.js
│   └── Supply.js
├── scripts/
│   └── seed.js             # Database seeding script
└── public/                 # Static assets
```

## Database Schema

### User Model
- Name, email, password (hashed)
- Timestamps for created/updated dates

### Project Model
- Name, description, start/due dates
- Status (planning, ongoing, completed, paused)
- Progress percentage (0-100)
- Supply list and tasks array
- Important flag
- User reference

### Supply Model
- Name, category, quantity, unit
- Color and notes fields
- User reference

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Features in Detail

### Authentication
- Email/password registration and login
- Protected routes with session management
- Automatic redirects based on authentication status

### Project Management
- Create projects with detailed information
- Track progress with visual indicators
- Manage project tasks with completion toggles
- Filter by status (all, planning, ongoing, completed, paused)
- Mark projects as important
- Search projects by name or description

### Supply Inventory
- Categorized supply management (yarn, fabric, thread, tools, etc.)
- Quantity tracking with custom units
- Color and notes fields for detailed tracking
- Filter by category and search functionality

### User Interface
- Responsive design for mobile and desktop
- Sidebar navigation with collapsible mobile menu
- Modal forms for adding/editing items
- Confirmation dialogs for destructive actions
- Loading states and error handling
- Clean, accessible design patterns

## Security Features

- Password hashing with bcryptjs
- Protected API routes with session validation
- CSRF protection via NextAuth.js
- Environment variable configuration
- Secure cookie management

## Deployment

1. **Environment Variables**
   Set production environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `NEXTAUTH_SECRET` - A secure random string
   - `NEXTAUTH_URL` - Your production domain

2. **Build and Deploy**
   ```bash
   npm run build
   npm run start
   ```

3. **Database Setup**
   Ensure your MongoDB instance is accessible from your hosting environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the repository or contact the development team.
