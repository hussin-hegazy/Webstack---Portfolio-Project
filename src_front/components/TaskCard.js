// import React from 'react';
// import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

// const TaskCard = ({ task, onToggleComplete, onUpdate, onDelete }) => {
//   return (
//     <div className="card task-card">
//       <div className="card-body">
//         <h6 className="card-title">{task.title}</h6>
//         <p className="card-text">{task.description}</p>
//         <span className="badge">{task.priority}</span>
//         <span className="text-muted">Due: {new Date(task.dueDate).toLocaleString()}</span>
//         <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
//           <button
//             className={`icon-button ${task.completed ? 'completed' : 'incomplete'}`}
//             onClick={() => onToggleComplete(task._id, !task.completed)}
//           >
//             {task.completed ? <FaCheck size={16} /> : <FaTimes size={16} />}
//           </button>
//           <button
//             className="icon-button"
//             onClick={() => onUpdate(task)}
//           >
//             <FaEdit size={16} />
//           </button>
//           <button
//             className="icon-button danger"
//             onClick={() => onDelete(task._id)}
//           >
//             <FaTrash size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskCard;




import React, { useState, useEffect } from 'react';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState('');

  // دالة لحساب الوقت المتبقي
  const calculateTimeLeft = () => {
    const now = new Date();
    const due = new Date(task.dueDate);
    const timeLeft = due - now;

    if (timeLeft < 0) return 'Expired';

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  // تحديث الوقت المتبقي تلقائيًا كل دقيقة
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // تحديث كل دقيقة

    return () => clearInterval(interval);
  }, [task.dueDate]);

  // دالة للتعامل مع الضغط على زر Completed
  const handleToggleComplete = () => {
    onToggleComplete(task._id, !task.completed); // تحديث حالة المهمة في الخادم
    setTimeLeft('0h 0m'); // تصفير الوقت المتبقي
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        {/* تفاصيل المهمة */}
        <h6 className="card-title">{task.title}</h6>
        <p className="card-text">{task.description}</p>
        <span className="badge bg-secondary">{task.priority}</span>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="text-muted">Due: {new Date(task.dueDate).toLocaleString()}</span>
          <span className={`fw-bold ${task.completed ? 'text-warning' : ''}`}>
            Time Left: {task.completed ? '0h 0m' : timeLeft}
          </span>
        </div>

        {/* الأيقونات (إكمال، تعديل، حذف) */}
        <div className="mt-3 d-flex justify-content-start gap-2">
          <button
            className={`btn btn-sm ${task.completed ? 'btn-success' : 'btn-outline-success'}`}
            onClick={handleToggleComplete}
            title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          >
            <FaCheck />
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <FaEdit />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(task._id)}
            title="Delete Task"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;