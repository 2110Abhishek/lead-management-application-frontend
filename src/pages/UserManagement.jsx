import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User created successfully');
      setFormData({ name: '', email: '', password: '', role: 'member' });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating user');
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="mb-8">User Management</h2>

      <div className="grid-layout">
        <div className="card">
          <h3>Create New User</h3>
          {error && <div className="badge badge-lost w-full text-center mt-4 py-2">{error}</div>}
          {success && <div className="badge badge-won w-full text-center mt-4 py-2">{success}</div>}
          
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-control" value={formData.role} onChange={handleChange}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-full">Create User</button>
          </form>
        </div>

        <div className="card table-container">
          <h3>Team Members</h3>
          <table className="data-table mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3">Loading...</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u._id}>
                    <td className="font-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${u.role === 'admin' ? 'won' : 'contacted'}`}>{u.role}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
