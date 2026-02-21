import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function UpdateProfile() {
  const [form, setForm] = useState({
    cgpa: '', backlogs: '', passingYear: '',
    skills: '', phone: '', linkedin: '', github: '',
    education: { degree: '', branch: '', college: '', year: '' },
    projects: [{ title: '', description: '', techStack: '' }],
    internships: [{ role: '', company: '', duration: '' }],
    workExperience: false
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEduChange = (e) => setForm({ ...form, education: { ...form.education, [e.target.name]: e.target.value } });

  const handleProjectChange = (index, e) => {
    const updated = [...form.projects];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, projects: updated });
  };

  const handleInternshipChange = (index, e) => {
    const updated = [...form.internships];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, internships: updated });
  };

  const addProject = () => setForm({ ...form, projects: [...form.projects, { title: '', description: '', techStack: '' }] });
  const addInternship = () => setForm({ ...form, internships: [...form.internships, { role: '', company: '', duration: '' }] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/profile', {
        cgpa: Number(form.cgpa),
        backlogs: Number(form.backlogs),
        passingYear: Number(form.passingYear),
        skills: form.skills.split(',').map(s => s.trim()),
        phone: form.phone,
        linkedin: form.linkedin,
        github: form.github,
        workExperience: form.workExperience,
        education: { ...form.education, year: Number(form.education.year) },
        projects: form.projects,
        internships: form.internships
      });
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => navigate('/student'), 1500);
    } catch (err) {
      setMessage('❌ Error updating profile');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '500px' }}>
        <h2 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: '20px' }}>🎓 Update Your Profile</h2>
        {message && <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#1a73e8' }}>{message}</p>}
        <form onSubmit={handleSubmit}>

          <h4 style={{ color: '#1a73e8', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>📞 Contact Details</h4>
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="linkedin" placeholder="LinkedIn URL" value={form.linkedin} onChange={handleChange} />
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="github" placeholder="GitHub URL" value={form.github} onChange={handleChange} />

          <h4 style={{ color: '#1a73e8', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>🎓 Academic Details</h4>
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="cgpa" placeholder="CGPA (e.g. 8.5)" value={form.cgpa} onChange={handleChange} required />
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="backlogs" placeholder="Backlogs (e.g. 0)" value={form.backlogs} onChange={handleChange} required />
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="passingYear" placeholder="Passing Year (e.g. 2026)" value={form.passingYear} onChange={handleChange} required />
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="skills" placeholder="Skills (e.g. Java, React, Python)" value={form.skills} onChange={handleChange} required />

          <h4 style={{ color: '#1a73e8', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>🏫 Education</h4>
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="degree" placeholder="Degree (e.g. MCA)" value={form.education.degree} onChange={handleEduChange} required />
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="branch" placeholder="Branch (e.g. MCA, CS)" value={form.education.branch} onChange={handleEduChange} required />
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="college" placeholder="College Name" value={form.education.college} onChange={handleEduChange} required />
          <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="year" placeholder="Graduation Year" value={form.education.year} onChange={handleEduChange} required />

          <h4 style={{ color: '#1a73e8', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>💼 Work Experience</h4>
          <select style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="workExperience" value={form.workExperience} onChange={(e) => setForm({ ...form, workExperience: e.target.value === 'true' })}>
            <option value="false">No Work Experience</option>
            <option value="true">Has Work Experience</option>
          </select>

          <h4 style={{ color: '#1a73e8', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>🚀 Projects</h4>
          {form.projects.map((project, index) => (
            <div key={index} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="title" placeholder="Project Title" value={project.title} onChange={(e) => handleProjectChange(index, e)} />
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="description" placeholder="Project Description" value={project.description} onChange={(e) => handleProjectChange(index, e)} />
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="techStack" placeholder="Tech Stack (e.g. React, Node.js)" value={project.techStack} onChange={(e) => handleProjectChange(index, e)} />
            </div>
          ))}
          <button type="button" style={{ background: '#34a853', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' }} onClick={addProject}>+ Add Project</button>

          <h4 style={{ color: '#1a73e8', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>🏢 Internships</h4>
          {form.internships.map((internship, index) => (
            <div key={index} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="role" placeholder="Role (e.g. Frontend Developer)" value={internship.role} onChange={(e) => handleInternshipChange(index, e)} />
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="company" placeholder="Company Name" value={internship.company} onChange={(e) => handleInternshipChange(index, e)} />
              <input style={{ width: '100%', padding: '10px', margin: '6px 0', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} name="duration" placeholder="Duration (e.g. 3 months)" value={internship.duration} onChange={(e) => handleInternshipChange(index, e)} />
            </div>
          ))}
          <button type="button" style={{ background: '#34a853', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' }} onClick={addInternship}>+ Add Internship</button>

          <button type="submit" style={{ width: '100%', padding: '10px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px', fontSize: '16px' }}>💾 Save Profile</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;