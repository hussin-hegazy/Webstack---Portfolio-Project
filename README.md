# Task Management System (Tasker)

This project is a **Task Management System** that allows users to create, manage, and track tasks efficiently. It consists of a **backend** (Node.js + Express + MongoDB) and a **frontend** (React.js) for a complete full-stack experience.

## Features

### Backend (Node.js + Express)
- User authentication (Email & Password, Google OAuth)
- Task management (Create, Read, Update, Delete)
- Task statistics and filtering (Completed, Priority-based, Calendar view)
- Role-based access control (Admin, Manager, User)
- Middleware for authentication, error handling, and file uploads
- Real-time notifications using **Socket.IO**
- Email notifications for task reminders

### Frontend (React.js)
- User-friendly dashboard to manage tasks
- Task list with filtering and sorting options
- Calendar integration for deadline tracking
- Statistics visualization using **Recharts**
- Responsive UI with Bootstrap
- Real-time updates with **Socket.IO**

## Technologies Used

### Backend:
- Node.js & Express.js
- MongoDB & Mongoose
- Passport.js (Google OAuth Authentication)
- JWT for user authentication
- Multer for file uploads
- Nodemailer for email notifications
- Redis for caching
- Socket.IO for real-time updates

### Frontend:
- React.js with React Router
- Bootstrap for UI design
- Recharts for visual analytics
- Axios for API requests
- FullCalendar for task scheduling
- React Toastify for notifications

## Installation & Setup

### Prerequisites:
- Node.js installed
- MongoDB running

### Backend Setup:
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up `.env` file with the required environment variables:
   ```env
   PORT=4000
   M_DB=mongodb+srv://your_connection_string
   SECRET_KEY=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup:
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication:
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/auth/google` - Google OAuth login
- `GET /api/users/me` - Get logged-in user info

### Task Management:
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:taskId` - Update a task
- `DELETE /api/tasks/:taskId` - Delete a task

### Statistics & Calendar:
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/by-date` - Get tasks filtered by date

## Project Structure

```
TaskManagementSystem/
│-- backend/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│-- frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│-- README.md
```

## Future Improvements
- Add unit & integration tests
- Implement a dark mode for the UI
- Enhance notifications with push messages
- Mobile app support with React Native

## Contributors
- **Hussin Saleh** (Lead Developer)

## License
This project is licensed under the MIT License.

