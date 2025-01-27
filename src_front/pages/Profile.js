import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', avatar: '', role: '', _id: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data.data.user); // تحقق من البيانات
        setUser(response.data.data.user);
      } catch (error) {
        toast.error('Failed to fetch user data.');
      }
    };
    fetchUser();
  }, []);

  // دالة لإنشاء مسار الصورة
  const getAvatarUrl = (avatar) => {
    if (!avatar) {
      return 'http://localhost:4000/uploads/default.png'; // صورة افتراضية إذا لم يكن هناك صورة
    }
    if (avatar.startsWith('http') || avatar.startsWith('https')) {
      return avatar; // إذا كان الرابط مباشرًا (مثل Google)، نستخدمه كما هو
    } else {
      return `http://localhost:4000/${avatar}`; // إذا كان مسارًا محليًا، نضيف المسار الكامل
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Profile Information</h4>
              <div className="text-center mb-4">
                <img
                  src={getAvatarUrl(user.avatar)}  // استخدام الدالة لإنشاء مسار الصورة
                  alt="Profile"
                  className="img-fluid rounded-circle"
                  style={{ width: '150px', height: '150px', border: '4px solid #007bff' }}
                  onError={(e) => {
                    e.target.src = 'http://localhost:4000/uploads/default.png'; // صورة افتراضية في حالة الخطأ
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={user.name}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={user.email}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label fw-bold">Role</label>
                <input
                  type="text"
                  className="form-control"
                  id="role"
                  value={user.role}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="id" className="form-label fw-bold">User ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="id"
                  value={user._id}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
