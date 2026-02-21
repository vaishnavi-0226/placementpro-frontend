import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [drives, setDrives] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [newDrive, setNewDrive] = useState({
    companyName: '', jobRole: '', minCgpa: '', maxBacklogs: '',
    branchesAllowed: '', skillsRequired: '', deadline: ''
  });
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  useEffect(() => {
    fetchStats();
    fetchDrives();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDrives = async () => {
    try {
      const res = await API.get('/drives');
      setDrives(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDriveChange = (e) => setNewDrive({ ...newDrive, [e.target.name]: e.target.value });

  const createDrive = async (e) => {
    e.preventDefault();
    try {
      await API.post('/drives', {
        ...newDrive,
        minCgpa: Number(newDrive.minCgpa),
        maxBacklogs: Number(newDrive.maxBacklogs),
        branchesAllowed: newDrive.branchesAllowed.split(',').map(b => b.trim()),
        skillsRequired: newDrive.skillsRequired.split(',').map(s => s.trim())
      });
      alert('✅ Drive created!');
      fetchDrives();
      setNewDrive({ companyName: '', jobRole: '', minCgpa: '', maxBacklogs: '', branchesAllowed: '', skillsRequired: '', deadline: '' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating drive');
    }
  };

  const notifyStudents = async (driveId) => {
    try {
      const res = await API.post(`/drives/${driveId}/notify`);
      alert(res.data.message);
    } catch (err) {
      alert('Error sending notifications');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🎓 PlacementPro Admin</h2>
        <span style={styles.welcome}>Welcome, {name}!</span>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button style={activeTab === 'stats' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('stats')}>📊 Dashboard</button>
        <button style={activeTab === 'drives' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('drives')}>🏢 Drives</button>
        <button style={activeTab === 'create' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('create')}>➕ Create Drive</button>
      </div>

      {/* STATS */}
      {activeTab === 'stats' && (
        <div style={styles.content}>
          <h3>Dashboard Overview</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}><h2>{stats.totalStudents}</h2><p>Total Students</p></div>
            <div style={styles.statCard}><h2>{stats.totalDrives}</h2><p>Total Drives</p></div>
            <div style={styles.statCard}><h2>{stats.totalApplications}</h2><p>Total Applications</p></div>
            <div style={styles.statCard}><h2>{stats.selectedStudents}</h2><p>Selected Students</p></div>
          </div>
        </div>
      )}

      {/* DRIVES */}
      {activeTab === 'drives' && (
        <div style={styles.content}>
          <h3>All Drives</h3>
          {drives.map(drive => (
            <div key={drive._id} style={styles.card}>
              <h4>{drive.companyName} — {drive.jobRole}</h4>
              <p>Min CGPA: {drive.minCgpa} | Max Backlogs: {drive.maxBacklogs}</p>
              <p>Branches: {drive.branchesAllowed?.join(', ')}</p>
              <p>Deadline: {new Date(drive.deadline).toDateString()}</p>
              <button style={styles.notifyBtn} onClick={() => notifyStudents(drive._id)}>
                📧 Notify Eligible Students
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CREATE DRIVE */}
      {activeTab === 'create' && (
        <div style={styles.content}>
          <h3>Create New Drive</h3>
          <div style={styles.card}>
            <form onSubmit={createDrive}>
              <input style={styles.input} name="companyName" placeholder="Company Name" value={newDrive.companyName} onChange={handleDriveChange} required />
              <input style={styles.input} name="jobRole" placeholder="Job Role" value={newDrive.jobRole} onChange={handleDriveChange} required />
              <input style={styles.input} name="minCgpa" placeholder="Min CGPA" type="number" step="0.1" value={newDrive.minCgpa} onChange={handleDriveChange} required />
              <input style={styles.input} name="maxBacklogs" placeholder="Max Backlogs" type="number" value={newDrive.maxBacklogs} onChange={handleDriveChange} required />
              <input style={styles.input} name="branchesAllowed" placeholder="Branches (e.g. MCA, CS)" value={newDrive.branchesAllowed} onChange={handleDriveChange} required />
              <input style={styles.input} name="skillsRequired" placeholder="Skills (e.g. Java, React)" value={newDrive.skillsRequired} onChange={handleDriveChange} required />
              <input style={styles.input} name="deadline" type="date" value={newDrive.deadline} onChange={handleDriveChange} required />
              <button style={styles.button} type="submit">Create Drive</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f0f2f5' },
  navbar: { background: '#1a73e8', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { margin: 0 },
  welcome: { fontSize: '16px' },
  logoutBtn: { background: '#ff4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
  tabs: { display: 'flex', background: 'white', padding: '10px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  tab: { padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '15px', color: '#555' },
  activeTab: { padding: '10px 20px', border: 'none', background: '#e8f0fe', cursor: 'pointer', fontSize: '15px', color: '#1a73e8', borderRadius: '5px', fontWeight: 'bold' },
  content: { padding: '30px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
  card: { background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' },
  input: { width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { width: '100%', padding: '10px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontSize: '16px' },
  notifyBtn: { background: '#34a853', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer' }
};

export default AdminDashboard;