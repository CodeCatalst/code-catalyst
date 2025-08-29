import { useState } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null
  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white transition-all animate-fade-in-down ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
      role="alert"
    >
      <span>{message}</span>
      <button className="ml-4 text-white/80 hover:text-white text-lg font-bold" onClick={onClose}>&times;</button>
    </div>
  )
}
