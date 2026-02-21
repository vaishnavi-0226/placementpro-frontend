import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const stages = ['Applied', 'Aptitude', 'Technical', 'HR', 'Selected'];

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs/feed');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await API.get('/jobs/my-applications');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const applyJob = async (jobId) => {
    try {
      await API.post(`/jobs/apply/${jobId}`);
      alert('✅ Applied successfully!');
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.error || 'Already applied');
    }
  };

  const downloadResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/resume/generate', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
    } catch (err) {
      alert('Error downloading resume');
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
        <h2 style={styles.logo}>🎓 PlacementPro</h2>
        <span style={styles.welcome}>Welcome, {name}!</span>

        <div>
          <button style={styles.resumeBtn} onClick={downloadResume}>
            📄 Download Resume
          </button>

          <button
            style={styles.resumeBtn}
            onClick={() => navigate('/update-profile')}
          >
            ✏️ Update Profile
          </button>

          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'jobs' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('jobs')}
        >
          💼 Job Feed
        </button>

        <button
          style={activeTab === 'applications' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('applications')}
        >
          📋 My Applications
        </button>
      </div>

      {/* JOB FEED */}
      {activeTab === 'jobs' && (
        <div style={styles.content}>
          <h3>Eligible Jobs For You</h3>

          {jobs.length === 0 ? (
            <p>No eligible jobs found. Update your profile to see jobs.</p>
          ) : (
            jobs.map(job => (
              <div key={job._id} style={styles.card}>
                <h4>{job.companyName} — {job.designation}</h4>
                <p>💰 {job.lpa} LPA</p>
                <p>Min CGPA: {job.minCgpa}</p>

                <button
                  style={styles.applyBtn}
                  onClick={() => applyJob(job._id)}
                >
                  Apply Now
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div style={styles.content}>
          <h3>My Applications</h3>

          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            applications.map(app => {
              const currentIndex = stages.indexOf(app.status);

              return (
                <div key={app._id} style={styles.card}>
                  <h4>{app.job?.companyName} — {app.job?.designation}</h4>

                  {/* Progress Tracker */}
                  <div style={styles.progressContainer}>
                    {stages.map((stage, index) => {
                      const isActive = index <= currentIndex;
                      const isRejected = app.status === 'Rejected';

                      return (
                        <div
                          key={stage}
                          style={{
                            ...styles.stage,
                            background: isRejected
                              ? '#f8d7da'
                              : isActive
                              ? '#1a73e8'
                              : '#ddd',
                            color: isActive ? 'white' : '#555'
                          }}
                        >
                          {stage}
                        </div>
                      );
                    })}
                  </div>

                  {app.status === 'Rejected' && (
                    <p style={styles.rejectedText}>
                      ❌ Application Rejected
                    </p>
                  )}

                  {app.status === 'Selected' && (
                    <p style={styles.selectedText}>
                      🎉 Congratulations! You are Selected!
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    background: '#f0f2f5'
  },
  navbar: {
    background: '#1a73e8',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: { margin: 0 },
  welcome: { fontSize: '16px' },
  resumeBtn: {
    background: 'white',
    color: '#1a73e8',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px'
  },
  logoutBtn: {
    background: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  tabs: {
    display: 'flex',
    background: 'white',
    padding: '10px 30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#555'
  },
  activeTab: {
    padding: '10px 20px',
    border: 'none',
    background: '#e8f0fe',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#1a73e8',
    borderRadius: '5px',
    fontWeight: 'bold'
  },
  content: { padding: '30px' },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '15px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
  },
  applyBtn: {
    background: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  progressContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    flexWrap: 'wrap'
  },
  stage: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  rejectedText: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  selectedText: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: '10px'
  }
};

export default StudentDashboard;