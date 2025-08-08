import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setStatus('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setStatus('Passwords do not match.');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Password reset successful! You can now log in.');
      } else {
        setStatus(data.error || 'Failed to reset password.');
      }
    } catch {
      setStatus('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className="p-8 text-center text-red-600">Invalid or missing reset token.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
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
        {status && <div className="mt-4 text-center text-red-600">{status}</div>}
      </div>
    </div>
  );
}
