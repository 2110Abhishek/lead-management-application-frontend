import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Send, Clock, User as UserIcon } from 'lucide-react';
import './LeadDetails.css';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchLeadData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLead(res.data.lead);
      setNotes(res.data.notes);
      setActivities(res.data.activities);
      
      if (user?.role === 'admin') {
        const usersRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  const handleStatusChange = async (e) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads/${id}`, { status: e.target.value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignmentChange = async (e) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads/${id}`, { assignedTo: e.target.value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads/${id}/notes`, { message: newNote }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewNote('');
      fetchLeadData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!lead) return <div>Lead not found.</div>;

  return (
    <div className="lead-details animate-fade-in">
      <Link to="/dashboard" className="btn btn-secondary mb-4" style={{display: 'inline-flex', padding: '6px 12px'}}>
        <ArrowLeft size={16} /> Back to Leads
      </Link>

      <div className="grid-layout">
        <div className="left-col">
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2>{lead.company}</h2>
              <span className={`badge badge-${lead.status.toLowerCase().replace(' ', '')}`}>{lead.status}</span>
            </div>
            <div className="lead-info-grid">
              <div className="info-item">
                <label>Contact Name</label>
                <p>{lead.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{lead.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{lead.phone}</p>
              </div>
              <div className="info-item">
                <label>Budget</label>
                <p>₹{lead.budget.toLocaleString()}</p>
              </div>
              <div className="info-item full-width">
                <label>Requirement</label>
                <p>{lead.requirement}</p>
              </div>
            </div>

            <div className="actions-section mt-8 pt-6 border-t border-muted">
              <h3>Manage Lead</h3>
              <div className="flex gap-4 mt-4">
                <div className="form-group flex-1">
                  <label className="form-label">Update Status</label>
                  <select className="form-control" value={lead.status} onChange={handleStatusChange}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                {user?.role === 'admin' && (
                  <div className="form-group flex-1">
                    <label className="form-label">Assign To</label>
                    <select className="form-control" value={lead.assignedTo?._id || ''} onChange={handleAssignmentChange}>
                      <option value="">Unassigned</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Notes</h3>
            <form onSubmit={handleAddNote} className="mt-4 mb-6 relative">
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></textarea>
              <button type="submit" className="btn btn-primary absolute bottom-4 right-4 py-1 px-3">
                <Send size={16} /> Post
              </button>
            </form>

            <div className="notes-list">
              {notes.map(note => (
                <div key={note._id} className="note-item">
                  <div className="note-header">
                    <span className="note-author"><UserIcon size={14}/> {note.author.name}</span>
                    <span className="note-time"><Clock size={12}/> {new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="note-message">{note.message}</p>
                </div>
              ))}
              {notes.length === 0 && <p className="text-muted text-center py-4">No notes yet.</p>}
            </div>
          </div>
        </div>

        <div className="right-col">
          <div className="card timeline-card">
            <h3>Activity Timeline</h3>
            <div className="timeline mt-6">
              {activities.map(activity => (
                <div key={activity._id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p className="timeline-action">{activity.action}</p>
                    <div className="timeline-meta">
                      {activity.user && <span>by {activity.user.name}</span>}
                      <span>{new Date(activity.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
