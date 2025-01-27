// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HandleLoginRedirect from './pages/HandleLoginRedirect';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Calendar from './components/Calendar';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/login" element={<HandleLoginRedirect />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
