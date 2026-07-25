import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', requirement: '', budget: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads`, formData);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    }
    setLoading(false);
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="container flex justify-between items-center">
          <div className="logo">LeadFlow AI</div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#services">Services</a>
            <Link to="/login" className="btn btn-secondary">Employee Login</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content animate-fade-in">
            <h1>Transform Your Sales Pipeline with Intelligent Lead Management</h1>
            <p>Capture, nurture, and convert leads faster than ever. Built for modern sales teams who demand excellence.</p>
            <div className="hero-badges">
              <span className="badge badge-new"><Zap size={14}/> Lightning Fast</span>
              <span className="badge badge-contacted"><Shield size={14}/> Secure</span>
              <span className="badge badge-qualified"><BarChart size={14}/> Data Driven</span>
            </div>
          </div>

          <div className="hero-form-container card glass animate-fade-in">
            {submitted ? (
              <div className="success-message text-center">
                <CheckCircle size={48} color="#10B981" />
                <h3>Application Received!</h3>
                <p>Our team will contact you shortly.</p>
                <button className="btn btn-primary mt-4" onClick={() => setSubmitted(false)}>Submit Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="lead-form">
                <h3>Get Started Today</h3>
                <p className="form-subtitle">Fill out the form below and we'll be in touch.</p>
                
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control" required onChange={handleChange} />
                </div>
                
                <div className="flex gap-4">
                  <div className="form-group w-full">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-control" required onChange={handleChange} />
                  </div>
                  <div className="form-group w-full">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" className="form-control" required onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input type="text" name="company" className="form-control" required onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Requirement / Project Details</label>
                  <textarea name="requirement" className="form-control" rows="3" required onChange={handleChange}></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Budget (₹)</label>
                  <input type="number" name="budget" className="form-control" required onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Request Consultation'} <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card card glass">
              <Zap className="feature-icon" size={32} />
              <h3>Lightning Fast</h3>
              <p>Experience zero lag when managing thousands of leads. Built on modern tech stack.</p>
            </div>
            <div className="feature-card card glass">
              <Shield className="feature-icon" size={32} />
              <h3>Secure & Private</h3>
              <p>Role-based access control ensures your data is only visible to the right people.</p>
            </div>
            <div className="feature-card card glass">
              <BarChart className="feature-icon" size={32} />
              <h3>Data Driven</h3>
              <p>Track every single status change, note, and assignment in our Activity Timeline.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="container">
          <div className="services-content card">
            <h2>Our Services</h2>
            <p>We provide full-stack CRM implementation, data migration, and 24/7 priority support to help your sales team focus on what matters: closing deals.</p>
            <ul className="services-list">
              <li>Custom Pipeline Setup</li>
              <li>Data Migration & Onboarding</li>
              <li>Team Training Sessions</li>
              <li>Enterprise API Access</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Decorative Background Elements */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
    </div>
  );
};

export default LandingPage;
