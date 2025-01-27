// import React from 'react';
// import TaskCard from './TaskCard';

// const TaskList = ({ tasks, onToggleComplete, onUpdate, onDelete }) => {
//   return (
//     <div className="row">
//       <div className="col-md-4">
//         <h5>To-do</h5>
//         {tasks
//           .filter((task) => !task.completed)
//           .map((task) => (
//             <TaskCard
//               key={task._id}
//               task={task}
//               onToggleComplete={onToggleComplete}
//               onUpdate={onUpdate}
//               onDelete={onDelete}
//             />
//           ))}
//       </div>
//       <div className="col-md-4">
//         <h5>In Progress</h5>
//         {tasks
//           .filter((task) => task.inProgress)
//           .map((task) => (
//             <TaskCard
//               key={task._id}
//               task={task}
//               onToggleComplete={onToggleComplete}
//               onUpdate={onUpdate}
//               onDelete={onDelete}
//             />
//           ))}
//       </div>
//       <div className="col-md-4">
//         <h5>Completed</h5>
//         {tasks
//           .filter((task) => task.completed)
//           .map((task) => (
//             <TaskCard
//               key={task._id}
//               task={task}
//               onToggleComplete={onToggleComplete}
//               onUpdate={onUpdate}
//               onDelete={onDelete}
//             />
//           ))}
//       </div>
//     </div>
//   );
// };

// export default TaskList;


import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete }) => {
  // تصفية المهام إلى قسمين: To-do و Completed
  const todoTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="row">
      {/* قسم To-do */}
      <div className="col-md-6">
        <h5 className="mb-3">To-do</h5>
        {todoTasks.length > 0 ? (
          todoTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="alert alert-info">No tasks to do. Add a new task!</div>
        )}
      </div>

      {/* قسم Completed */}
      <div className="col-md-6">
        <h5 className="mb-3">Completed</h5>
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="alert alert-info">No completed tasks yet.</div>
        )}
      </div>
    </div>
  );
};

export default TaskList;