# 🎓 Student Management System

A comprehensive full-stack web application for managing students, subjects, marks, and attendance with real-time analytics and reporting.

## Features

### User Management

- **Role-Based Authentication** - Separate login for Admin, Teacher, and Student
- **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- **Protected Routes** - Role-specific access control

### 📚 Student Management

- Add, edit, and delete student records
- View complete student profiles
- Pagination for efficient data handling
- Search and filter capabilities
- Delete confirmation dialogs

### 📖 Subject Management

- Create and manage subjects
- Animated subject cards with modern UI
- Pagination (10 subjects per page)
- Hover effects and smooth transitions

### 📝 Marks Management

- Record and track student marks by subject
- Filter marks by student
- Pagination for better performance
- Add/Edit marks with validation
- Subject-wise marks tracking

### ✅ Attendance Management

- Mark daily attendance (Present/Absent)
- Role-based views:
  - **Students**: View personal attendance with summary cards
  - **Teachers/Admin**: Mark attendance by date
- Attendance percentage calculations
- Date-wise filtering
- Visual status indicators

### 📊 Analytics & Reports

- **Real-time Analytics Dashboard**
  - Total students overview
  - Class average performance
  - Top performers ranking
  - Low attendance alerts
- **Interactive Visualizations**
  - Bar charts for subject-wise averages
  - Pie charts for performance distribution
  - Animated data cards
- **Detailed Reports**
  - Top performers list (clickable modal)
  - Students below 40% (clickable section)
  - Low attendance students (<75%) (clickable modal)
  - Visual highlighting and smooth navigation

### Modern UI/UX

- Responsive design for all screen sizes
- Animated loading states with spinners
- Smooth page transitions
- Card animations with staggered delays
- Gradient backgrounds and hover effects
- No page scrolling - optimized viewport layout
- Internal scrollable sections
- Consistent emerald/teal color theme

## 🛠️ Tech Stack

### Frontend

- **React** 19.2.0 - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** 7.13.0 - Client-side routing
- **Tailwind CSS** 4.2.0 - Utility-first CSS framework
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Radix UI** - Accessible UI components

### Backend

- **Node.js** - Runtime environment
- **Express** 5.2.1 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 9.2.1 - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

## 📁 Project Structure

```
studentmanagementsystem/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── subjectController.js
│   │   ├── markController.js
│   │   ├── attendanceController.js
│   │   ├── analyticsController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Subject.js
│   │   ├── Mark.js
│   │   └── Attendence.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── markRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── dashBoardRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI components
│   │   │   ├── AppLayout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Subjects.jsx
│   │   │   ├── Marks.jsx
│   │   │   ├── Attendance.jsx
│   │   │   └── Analytics.jsx
│   │   ├── services/
│   │   │   ├── auth.js
│   │   │   ├── students.js
│   │   │   ├── subjects.js
│   │   │   ├── marks.js
│   │   │   ├── attendance.js
│   │   │   ├── analytics.js
│   │   │   └── dashboard.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/studentmanagementsystem.git
cd studentmanagementsystem
```

2. **Backend Setup**

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

3. **Frontend Setup**

```bash
cd ../frontend
npm install
```

Create `.env` file in frontend directory (optional):

```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. **Start Backend Server**

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`

2. **Start Frontend Development Server**

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🌐 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables (if any)
5. Deploy

### Backend (Render/Railway/Heroku)

1. Create new web service
2. Connect to GitHub repository
3. Set build settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`
5. Deploy

### Update Frontend API URL

After deploying backend, update the API base URL in `frontend/src/services/*.js` files to your deployed backend URL.

## 👥 Default Users

After setting up the database, you'll need to create users with different roles:

**Admin**

- Can manage all students, subjects, marks, and attendance
- Full access to analytics

**Teacher**

- Can mark attendance
- Can add/edit marks
- View analytics

**Student**

- View personal marks
- View personal attendance
- Limited dashboard access

## 📸 Features Highlights

- ✅ Pagination across all data modules
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Real-time data validation
- ✅ Animated UI components
- ✅ Interactive analytics with clickable modals
- ✅ Role-based access control
- ✅ Secure authentication
- ✅ Modern glassmorphism effects
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization middleware
- Input validation on both frontend and backend
- Protected API routes
- CORS configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Built with modern React and Node.js best practices
- UI inspired by shadcn/ui components
- Charts powered by Recharts library

---

**Made with ❤️ by Ibrahim**
