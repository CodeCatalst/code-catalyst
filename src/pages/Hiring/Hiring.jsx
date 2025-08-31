
import { useState } from 'react';
// eslint-disable-next-line no-undef
const API_URL = import.meta.env.VITE_API_BASE;
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

const Hiring = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    semYear: '',
    position: '',
    about: '',
    cv: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    try {
      const res = await fetch(`${API_URL}/api/hiring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          course: form.course,
          semYear: form.semYear,
          position: form.position,
          about: form.about,
          cv: form.cv
        })
      });
      if (!res.ok) throw new Error('Failed to submit application');
      await res.json();
      setSubmitted(true);
      setForm({
        name: '',
        phone: '',
        email: '',
        course: '',
        semYear: '',
        position: '',
        about: '',
        cv: ''
      });
    } catch (err) {
      alert('There was an error submitting your application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="flex-1 flex mt-6 items-center justify-center py-12 px-2">
        <form onSubmit={handleSubmit} className="bg-gray-900/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-xl space-y-7 border border-gray-800">
          <h2 className="text-4xl font-extrabold text-white mb-6 text-center tracking-tight drop-shadow-lg">Join the Team</h2>
          <p className="text-gray-400 text-center mb-6 text-lg">Fill out the form below to apply for a position at Code Catalyst. We value passion, creativity, and teamwork!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Course</label>
              <input
                type="text"
                name="course"
                value={form.course}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
                placeholder="Your course (e.g. BCA, B.Tech)"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Sem/Year</label>
              <input
                type="text"
                name="semYear"
                value={form.semYear}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
                placeholder="Semester or Year (e.g. 3rd Sem, 2nd Year)"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Position applying for<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
                placeholder="e.g. Developer, Designer, PR, etc."
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-1 font-medium">About yourself</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={4}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1 font-medium">CV/Resume Drive Link (make sure it is accessible to anyone with the link) <span className="text-red-500">*</span></label>
            <input
              type="url"
              name="cv"
              value={form.cv}
              onChange={handleChange}
              required
              className="w-full p-5 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 shadow-sm text-sm"
              placeholder="Paste a Google Drive/OneDrive/Dropbox link to your CV"
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-4 py-3 text-lg font-semibold rounded-lg shadow-md">Submit Application</button>
          {submitted && (
            <div className="text-green-400 text-center mt-4 font-medium">Thank you for applying! We will get in touch soon.</div>
          )}
        </form>
      </main>
      
    </div>
  );
};

export default Hiring;
