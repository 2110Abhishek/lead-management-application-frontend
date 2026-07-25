import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Trash2 } from 'lucide-react';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useContext(AuthContext);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads?search=${search}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data.leads);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter]);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchLeads();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase().replace(' ', '');
    return `badge badge-${s}`;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2>{user?.role === 'admin' ? 'All Leads' : 'My Assigned Leads'}</h2>
      </div>

      <div className="card flex gap-4 items-center" style={{ marginBottom: '2rem' }}>
        <div className="form-group" style={{ marginBottom: 0, flex: 1, position: 'relative' }}>
          <Search size={18} style={{ color: 'var(--text-muted)', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search leads by name or company..." 
            className="form-control" 
            style={{ paddingLeft: '40px', width: '100%' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0, width: '200px' }}>
          <select 
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="card table-container">
        {loading ? (
          <p className="text-center py-8">Loading leads...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted">No leads found.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id}>
                    <td className="font-semibold">{lead.company}</td>
                    <td>
                      <div>{lead.name}</div>
                      <div className="text-muted text-sm" style={{fontSize: '0.8rem'}}>{lead.email}</div>
                    </td>
                    <td>
                      <span className={getStatusBadge(lead.status)}>{lead.status}</span>
                    </td>
                    <td>{lead.assignedTo ? lead.assignedTo.name : <span className="text-muted">Unassigned</span>}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link to={`/dashboard/leads/${lead._id}`} className="btn btn-secondary py-1 px-2">
                          <Eye size={16} />
                        </Link>
                        {user?.role === 'admin' && (
                          <button onClick={() => handleDelete(lead._id)} className="btn btn-secondary py-1 px-2" style={{color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)'}}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeadList;
