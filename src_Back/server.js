const mongoose = require('mongoose');
const express = require("express");
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const http = require('http');
const { socketHandler } = require('./utils/instantMessaging');
require('dotenv').config();

// استيراد الملفات
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
require('./config/passport'); // تهيئة Passport

// تهيئة التطبيق
const app = express();
const server = http.createServer(app);

// الاتصال بقاعدة البيانات
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// تهيئة Socket.IO
socketHandler.init(server);

// تهيئة تذكير المهام
require('./utils/taskReminder');

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Error Handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 404)
       .json({
         status: err.statusText || "Error", 
         message: err.message || "This is not found"
       });
});

// تشغيل الخادم
server.listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port", process.env.PORT || 4000);
});