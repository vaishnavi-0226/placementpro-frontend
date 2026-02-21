import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function AlumniDashboard() {
  const [referrals, setReferrals] = useState([]);
  const [slots, setSlots] = useState([]);
  const [activeTab, setActiveTab] = useState('referrals');
  const [newReferral, setNewReferral] = useState({ title: '', company: '', description: '', applyLink: '' });
  const [newSlot, setNewSlot] = useState({ date: '', time: '', topic: '' });
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  useEffect(() => {
    fetchReferrals();
    fetchSlots();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await API.get('/alumni/referrals');
      setReferrals(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSlots = async () => {
    try {
      const res = await API.get('/alumni/mentorship');
      setSlots(res.data);
    } catch (err) { console.error(err); }
  };

  const postReferral = async (e) => {
    e.preventDefault();
    try {
      await API.post('/alumni/referral', newReferral);
      alert('✅ Referral posted!');
      fetchReferrals();
      setNewReferral({ title: '', company: '', description: '', applyLink: '' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Error posting referral');
    }
  };

  const addSlot = async (e) => {
    e.preventDefault();
    try {
      await API.post('/alumni/mentorship', newSlot);
      alert('✅ Slot added!');
      fetchSlots();
      setNewSlot({ date: '', time: '', topic: '' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding slot');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f0f2f5' }}>
      {/* NAVBAR */}
      <div style={{ background: '#1a73e8', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>🎓 PlacementPro Alumni</h2>
        <span>Welcome, {name}!</span>
        <button style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }} onClick={logout}>Logout</button>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', background: 'white', padding: '10px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <button style={{ padding: '10px 20px', border: 'none', background: activeTab === 'referrals' ? '#e8f0fe' : 'none', cursor: 'pointer', fontSize: '15px', color: activeTab === 'referrals' ? '#1a73e8' : '#555', borderRadius: '5px', fontWeight: activeTab === 'referrals' ? 'bold' : 'normal' }} onClick={() => setActiveTab('referrals')}>💼 Job Referrals</button>
        <button style={{ padding: '10px 20px', border: 'none', background: activeTab === 'mentorship' ? '#e8f0fe' : 'none', cursor: 'pointer', fontSize: '15px', color: activeTab === 'mentorship' ? '#1a73e8' : '#555', borderRadius: '5px', fontWeight: activeTab === 'mentorship' ? 'bold' : 'normal' }} onClick={() => setActiveTab('mentorship')}>🤝 Mentorship</button>
        <button style={{ padding: '10px 20px', border: 'none', background: activeTab === 'post' ? '#e8f0fe' : 'none', cursor: 'pointer', fontSize: '15px', color: activeTab === 'post' ? '#1a73e8' : '#555', borderRadius: '5px', fontWeight: activeTab === 'post' ? 'bold' : 'normal' }} onClick={() => setActiveTab('post')}>➕ Post Referral</button>
        <button style={{ padding: '10px 20px', border: 'none', background: activeTab === 'addslot' ? '#e8f0fe' : 'none', cursor: 'pointer', fontSize: '15px', color: activeTab === 'addslot' ? '#1a73e8' : '#555', borderRadius: '5px', fontWeight: activeTab === 'addslot' ? 'bold' : 'normal' }} onClick={() => setActiveTab('addslot')}>📅 Add Slot</button>
      </div>

      {/* JOB REFERRALS */}
      {activeTab === 'referrals' && (
        <div style={{ padding: '30px' }}>
          <h3>Job Referrals from Alumni</h3>
          {referrals.length === 0 ? <p>No referrals posted yet.</p> : referrals.map((r, i) => (
            <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
              <h4>{r.title} — {r.company}</h4>
              <p>{r.description}</p>
              <p>Posted by: <strong>{r.postedBy}</strong> ({r.alumniDesignation} at {r.alumniCompany})</p>
              {r.applyLink && <a href={r.applyLink} target="_blank" rel="noreferrer" style={{ color: '#1a73e8' }}>Apply Here →</a>}
            </div>
          ))}
        </div>
      )}

      {/* MENTORSHIP SLOTS */}
      {activeTab === 'mentorship' && (
        <div style={{ padding: '30px' }}>
          <h3>Available Mentorship Slots</h3>
          {slots.length === 0 ? <p>No slots available yet.</p> : slots.filter(s => !s.isBooked).map((s, i) => (
            <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
              <h4>{s.topic}</h4>
              <p>📅 {s.date} at ⏰ {s.time}</p>
              <p>Mentor: <strong>{s.alumniName}</strong> — {s.alumniDesignation} at {s.alumniCompany}</p>
              <button style={{ background: '#34a853', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer' }}
                onClick={async () => {
                  try {
                    await API.put(`/alumni/mentorship/${s.alumniId}/${s._id}/book`);
                    alert('✅ Slot booked!');
                    fetchSlots();
                  } catch (err) {
                    alert(err.response?.data?.msg || 'Error booking slot');
                  }
                }}>Book Slot</button>
            </div>
          ))}
        </div>
      )}

      {/* POST REFERRAL */}
      {activeTab === 'post' && (
        <div style={{ padding: '30px' }}>
          <h3>Post a Job Referral</h3>
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
            <form onSubmit={postReferral}>
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} placeholder="Job Title" value={newReferral.title} onChange={(e) => setNewReferral({ ...newReferral, title: e.target.value })} required />
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} placeholder="Company" value={newReferral.company} onChange={(e) => setNewReferral({ ...newReferral, company: e.target.value })} required />
              <textarea style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} placeholder="Job Description" rows="3" value={newReferral.description} onChange={(e) => setNewReferral({ ...newReferral, description: e.target.value })} />
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} placeholder="Apply Link (URL)" value={newReferral.applyLink} onChange={(e) => setNewReferral({ ...newReferral, applyLink: e.target.value })} />
              <button type="submit" style={{ width: '100%', padding: '10px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontSize: '16px' }}>Post Referral</button>
            </form>
          </div>
        </div>
      )}

      {/* ADD MENTORSHIP SLOT */}
      {activeTab === 'addslot' && (
        <div style={{ padding: '30px' }}>
          <h3>Add Mentorship Slot</h3>
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
            <form onSubmit={addSlot}>
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })} required />
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} type="time" value={newSlot.time} onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })} required />
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} placeholder="Topic (e.g. Mock Interview, Resume Review)" value={newSlot.topic} onChange={(e) => setNewSlot({ ...newSlot, topic: e.target.value })} required />
              <button type="submit" style={{ width: '100%', padding: '10px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontSize: '16px' }}>Add Slot</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlumniDashboard;