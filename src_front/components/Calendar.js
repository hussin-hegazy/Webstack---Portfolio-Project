import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/tasks/by-date', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
          },
        });
        const tasks = response.data.data.tasks.map((task) => ({
          id: task._id,
          title: task.title,
          start: task.dueDate,
          allDay: true,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          completed: task.completed,
          color: '#007bff', // تغيير لون خلفية المهمة إلى الأزرق
        }));
        setEvents(tasks);
      } catch (error) {
        toast.error('Failed to fetch tasks.');
      }
    };
    fetchTasks();
  }, []);

  const handleDateClick = (arg) => {
    alert(`Date clicked: ${arg.dateStr}`);
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div
        data-tooltip-id="task-tooltip"
        data-tooltip-place="top"
        onMouseEnter={() => setSelectedTask(eventInfo.event)}
        style={{ backgroundColor: eventInfo.event.color, padding: '5px', borderRadius: '5px', color: '#ffffff' }} // لون خلفية المهمة ونص أبيض
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {eventInfo.event.title}
          {eventInfo.event.extendedProps.completed ? (
            <FaCheckCircle className="status-icon completed" />
          ) : (
            <FaTimesCircle className="status-icon incomplete" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Task Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventContent={renderEventContent}
      />

      {selectedTask && (
        <Tooltip
          id="task-tooltip"
          className="custom-tooltip"
          openOnClick={false}
          positionStrategy="fixed"
        >
          <div className="tooltip-content">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {selectedTask.title}
              {selectedTask.extendedProps.completed ? (
                <FaCheckCircle className="status-icon completed" />
              ) : (
                <FaTimesCircle className="status-icon incomplete" />
              )}
            </h4>
            <div>
              <strong>Description:</strong>
              <div style={{ marginTop: '5px' }}>{selectedTask.extendedProps.description}</div>
            </div>
            <p>
              <FaCalendarAlt className="icon" />
              <strong>Due Date:</strong> {new Date(selectedTask.extendedProps.dueDate).toLocaleString()}
            </p>
            <p>
              <FaExclamationCircle className="icon" />
              <strong>Priority:</strong> {selectedTask.extendedProps.priority}
            </p>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default Calendar;
