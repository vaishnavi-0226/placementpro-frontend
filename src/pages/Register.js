import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('name', res.data.user.name);

      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else if (res.data.user.role === 'alumni') {
        navigate('/alumni');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '5px' }}>🎓 PlacementPro</h2>
        <h3 style={{ textAlign: 'center', color: '#555', marginBottom: '20px' }}>Register</h3>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
            <option value="admin">Admin</option>
          </select>
          <button style={{ width: '100%', padding: '10px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontSize: '16px' }} type="submit">Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;