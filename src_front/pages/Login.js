import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // التحقق من وجود التوكن عند تحميل الصفحة
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); // توجيه المستخدم إلى لوحة التحكم إذا كان مسجل الدخول
    }
  }, [navigate]);

  // دالة لتسجيل الدخول عبر Google
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/api/users/auth/google';
  };

  // دالة لتسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', { email, password });
      localStorage.setItem('token', response.data.data.token); // حفظ التوكن في localStorage
      navigate('/dashboard'); // توجيه المستخدم إلى لوحة التحكم
      toast.success('Login successful!'); // عرض رسالة تأكيد
    } catch (error) {
      console.error('Login failed:', error.response.data);
      toast.error('Login failed. Please try again.'); // عرض رسالة خطأ
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="text-center">Login</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
                {/* زر تسجيل الدخول عبر Google */}
                <button
                  type="button"
                  className="btn btn-danger w-100 mt-3"
                  onClick={handleGoogleLogin}
                >
                  Login with Google
                </button>
              </form>
              <div className="text-center mt-3">
                <Link to="/register">Don't have an account? Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;