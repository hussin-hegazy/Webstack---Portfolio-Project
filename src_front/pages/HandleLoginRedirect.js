import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HandleLoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token); // حفظ التوكن في localStorage
      navigate('/dashboard'); // توجيه المستخدم إلى لوحة التحكم
      toast.success('Login successful!'); // عرض رسالة تأكيد
    }
  }, [navigate, location]);

  return null; // لا يعرض أي واجهة
};

export default HandleLoginRedirect;