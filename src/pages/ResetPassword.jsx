import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setStatus('Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setStatus('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus('Please enter a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setStatus('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirm) {
      setStatus('Passwords do not match.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          newPassword: formData.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Password reset successful! You can now log in with your new password.');
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirm: ''
        });
      } else {
        setStatus(data.error || 'Failed to reset password.');
      }
    } catch (error) {
      setStatus('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Reset Your Password</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Enter your name, email address, and new password to reset your account password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your email address"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter new password"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Confirm new password"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {status && (
          <div className={`mt-4 text-center ${status.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
