// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Reports = () => {
//   const [stats, setStats] = useState({
//     completedTasks: 0,
//     incompleteTasks: 0,
//     tasksByPriority: [],
//     tasksByDate: [],
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:4000/api/tasks/stats', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStats(response.data.data);
//       } catch (error) {
//         toast.error('Failed to fetch stats.');
//       }
//     };
//     fetchStats();
//   }, []);

//   // بيانات الرسم البياني للمهام المكتملة وغير المكتملة
//   const taskCompletionData = [
//     { name: 'Completed', tasks: stats.completedTasks },
//     { name: 'Incomplete', tasks: stats.incompleteTasks },
//   ];

//   // بيانات الرسم البياني للمهام حسب الأولوية
//   const priorityData = stats.tasksByPriority.map((item) => ({
//     name: item._id,
//     tasks: item.count,
//   }));

//   // ألوان للرسم البياني
//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Task Reports</h2>

//       <div className="row">
//         {/* الرسم البياني للمهام المكتملة وغير المكتملة */}
//         <div className="col-md-6 mb-4">
//           <div className="card shadow">
//             <div className="card-body">
//               <h5 className="card-title">Task Completion</h5>
//               <BarChart width={400} height={300} data={taskCompletionData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="tasks" fill="#8884d8" />
//               </BarChart>
//             </div>
//           </div>
//         </div>

//         {/* الرسم البياني للمهام حسب الأولوية */}
//         <div className="col-md-6 mb-4">
//           <div className="card shadow">
//             <div className="card-body">
//               <h5 className="card-title">Tasks by Priority</h5>
//               <PieChart width={400} height={300}>
//                 <Pie
//                   data={priorityData}
//                   dataKey="tasks"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   fill="#8884d8"
//                   label
//                 >
//                   {priorityData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* إحصائيات إضافية */}
//       <div className="row">
//         <div className="col-md-12">
//           <div className="card shadow">
//             <div className="card-body">
//               <h5 className="card-title">Additional Statistics</h5>
//               <div className="row">
//                 <div className="col-md-4">
//                   <div className="card bg-light mb-3">
//                     <div className="card-body">
//                       <h6 className="card-title">Total Tasks</h6>
//                       <p className="card-text fs-4">{stats.completedTasks + stats.incompleteTasks}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="card bg-light mb-3">
//                     <div className="card-body">
//                       <h6 className="card-title">Completed Tasks</h6>
//                       <p className="card-text fs-4">{stats.completedTasks}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="card bg-light mb-3">
//                     <div className="card-body">
//                       <h6 className="card-title">Incomplete Tasks</h6>
//                       <p className="card-text fs-4">{stats.incompleteTasks}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reports;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reports = () => {
  const [stats, setStats] = useState({
    completedTasks: 0,
    incompleteTasks: 0,
    tasksByPriority: [],
    tasksByDate: [],
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
        toast.error('Failed to fetch stats.');
      }
    };
    fetchStats();
  }, []);

  // بيانات الرسم البياني للمهام المكتملة وغير المكتملة
  const taskCompletionData = [
    { name: 'Completed', tasks: stats.completedTasks },
    { name: 'Incomplete', tasks: stats.incompleteTasks },
  ];

  // بيانات الرسم البياني للمهام حسب الأولوية
  const priorityData = stats.tasksByPriority.map((item) => ({
    name: item._id,
    tasks: item.count,
  }));

  // ألوان للرسم البياني
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Task Reports</h2>

      <div className="row">
        {/* الرسم البياني للمهام المكتملة وغير المكتملة */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Task Completion</h5>
              <BarChart width={400} height={300} data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#8884d8">
                  {taskCompletionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === 'Completed' ? '#00C49F' : '#FF8042'} // لون المكتمل: أخضر، لون غير المكتمل: برتقالي
                    />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </div>
        </div>

        {/* الرسم البياني للمهام حسب الأولوية */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Tasks by Priority</h5>
              <PieChart width={400} height={300}>
                <Pie
                  data={priorityData}
                  dataKey="tasks"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات إضافية */}
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Additional Statistics</h5>
              <div className="row">
                <div className="col-md-4">
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <h6 className="card-title">Total Tasks</h6>
                      <p className="card-text fs-4">{stats.completedTasks + stats.incompleteTasks}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <h6 className="card-title">Completed Tasks</h6>
                      <p className="card-text fs-4">{stats.completedTasks}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <h6 className="card-title">Incomplete Tasks</h6>
                      <p className="card-text fs-4">{stats.incompleteTasks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;