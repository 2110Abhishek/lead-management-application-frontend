import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Users, LayoutDashboard } from 'lucide-react';
import LeadList from './LeadList';
import LeadDetails from './LeadDetails';
import UserManagement from './UserManagement';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar card">
        <div className="sidebar-header">
          <h2>LeadFlow</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link to="/dashboard/users" className="nav-item">
              <Users size={20} /> Manage Users
            </Link>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role badge badge-new">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="dashboard-content">
        <Routes>
          <Route path="/" element={<LeadList />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
          {user?.role === 'admin' && (
            <Route path="/users" element={<UserManagement />} />
          )}
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
