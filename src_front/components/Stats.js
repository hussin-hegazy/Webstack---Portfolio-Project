import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const Stats = () => {
  const [stats, setStats] = useState({
    completedTasks: 0,
    incompleteTasks: 0,
    tasksByPriority: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/tasks/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error.response.data);
      }
    };

    fetchStats();
  }, []);

  const data = [
    { name: 'Completed', tasks: stats.completedTasks },
    { name: 'Incomplete', tasks: stats.incompleteTasks },
  ];

  const priorityData = stats.tasksByPriority.map((item) => ({
    name: item._id,
    tasks: item.count,
  }));

  return (
    <div className="container mt-5">
      <h2>Task Statistics</h2>
      <div className="row">
        <div className="col-md-6">
          <h4>Completed vs Incomplete Tasks</h4>
          <BarChart width={400} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="col-md-6">
          <h4>Tasks by Priority</h4>
          <BarChart width={400} height={300} data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Stats;