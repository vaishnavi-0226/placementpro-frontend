import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import UpdateProfile from './pages/UpdateProfile';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={token ? <StudentDashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={token ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/alumni" element={token ? <AlumniDashboard /> : <Navigate to="/" />} />
        <Route path="/update-profile" element={token ? <UpdateProfile /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;