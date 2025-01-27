import React, { useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import TaskList from "../components/TaskList";
import CreateTaskModal from "../components/CreateTaskModal";
import UpdateTaskModal from "../components/UpdateTaskModal";
import Reports from "../components/Reports";
import Calendar from "../components/Calendar";
import socket from "../utils/socket";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiHome, FiUser, FiBarChart2, FiCalendar, FiLogOut, FiPlusCircle, FiSearch, FiFileText } from "react-icons/fi";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTasks(data.data.tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();

    socket.connect();
    socket.on("taskCreated", (newTask) => setTasks((prev) => [...prev, newTask]));
    socket.on("taskUpdated", (updatedTask) =>
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)))
    );
    socket.on("taskDeleted", (deletedTaskId) =>
      setTasks((prev) => prev.filter((t) => t._id !== deletedTaskId))
    );

    return () => socket.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleCreateTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      setTasks([...tasks, data.data.task]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      setTasks(tasks.map((task) => (task._id === taskId ? data.data.task : task)));
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowUpdateModal(true);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h4 className="sidebar-title">Tasker</h4>
        <nav className="nav">
          <Link to="/dashboard" className="nav-link">
            <FiHome className="icon" /> Dashboard
          </Link>
          <button
            className="nav-link"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlusCircle className="icon" /> Create Task
          </button>
          <Link to="/profile" className="nav-link">
            <FiUser className="icon" /> Profile
          </Link>
          <Link to="/reports" className="nav-link">
            <FiFileText className="icon" /> Reports
          </Link>
          <Link to="/calendar" className="nav-link">
            <FiCalendar className="icon" /> Calendar
          </Link>
          <button className="nav-link logout-button" onClick={handleLogout}>
            <FiLogOut className="icon" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="search-bar">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="search-icon" />
          </div>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <TaskList
                tasks={filteredTasks}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onToggleComplete={(id, completed) =>
                  handleUpdateTask(id, { completed })
                }
              />
            }
          />
          <Route path="/reports" element={<Reports />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </main>

      {/* Modals */}
      <CreateTaskModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTask}
      />
      <UpdateTaskModal
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
};

export default Dashboard;
