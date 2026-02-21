import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function UpdateProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    linkedin: '',
    github: '',
    summary: '',
    skills: '',
    certifications: '',
    education: {
      tenth: { school: '', percentage: '', year: '' },
      puc: { college: '', percentage: '', year: '' },
      degree: { college: '', cgpa: '', year: '' }
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/profile');
      setFormData({
        ...res.data,
        skills: res.data.skills?.join(', ') || '',
        certifications: res.data.certifications?.join(', ') || ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field, subfield] = name.split('.');

      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [subfield]: value
          }
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()),
      certifications: formData.certifications.split(',').map(c => c.trim())
    };

    try {
      await API.put('/profile', updatedData);
      alert('✅ Profile Updated Successfully!');
      navigate('/student');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Update Profile (Resume Builder)</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        <input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} />
        <input name="github" placeholder="GitHub URL" value={formData.github} onChange={handleChange} />

        <textarea name="summary" placeholder="Professional Summary" value={formData.summary} onChange={handleChange} />

        <input name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} />

        <input name="certifications" placeholder="Certifications (comma separated)" value={formData.certifications} onChange={handleChange} />

        <h3>10th Education</h3>
        <input name="education.tenth.school" placeholder="School Name" value={formData.education.tenth.school} onChange={handleChange} />
        <input name="education.tenth.percentage" placeholder="Percentage" value={formData.education.tenth.percentage} onChange={handleChange} />
        <input name="education.tenth.year" placeholder="Year" value={formData.education.tenth.year} onChange={handleChange} />

        <h3>PUC Education</h3>
        <input name="education.puc.college" placeholder="College Name" value={formData.education.puc.college} onChange={handleChange} />
        <input name="education.puc.percentage" placeholder="Percentage" value={formData.education.puc.percentage} onChange={handleChange} />
        <input name="education.puc.year" placeholder="Year" value={formData.education.puc.year} onChange={handleChange} />

        <h3>Degree Education</h3>
        <input name="education.degree.college" placeholder="College Name" value={formData.education.degree.college} onChange={handleChange} />
        <input name="education.degree.cgpa" placeholder="CGPA" value={formData.education.degree.cgpa} onChange={handleChange} />
        <input name="education.degree.year" placeholder="Year" value={formData.education.degree.year} onChange={handleChange} />

        <button type="submit" style={styles.button}>Save Profile</button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: '30px', maxWidth: '600px', margin: 'auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  button: { padding: '10px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px' }
};

export default UpdateProfile;