// eslint-disable-next-line no-undef
const API_URL = import.meta.env.VITE_API_BASE;
import { useEffect, useState } from 'react';
// Add xlsx for Excel export
import * as XLSX from 'xlsx';

const AdminHiringRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/hiring`);
        if (!res.ok) throw new Error('Failed to fetch hiring requests');
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Excel download handler
  const handleDownloadExcel = () => {
    // Prepare worksheet data
    const wsData = [
      [
        'Name', 'Phone', 'Email', 'Course', 'Sem/Year', 'Position', 'About', 'CV', 'Submitted'
      ],
      ...requests.map(req => [
        req.name,
        req.phone,
        req.email,
        req.course,
        req.sem_year || req.semYear,
        req.position,
        req.about,
        req.cv_link || req.cv,
        req.submitted_at ? new Date(req.submitted_at).toLocaleString() : ''
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HiringRequests');
    XLSX.writeFile(wb, 'hiring_requests.xlsx');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Hiring Requests</h2>
        <button
          onClick={handleDownloadExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
          disabled={requests.length === 0}
        >
          Download Excel
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Sem/Year</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">About</th>
                <th className="px-4 py-2">CV</th>
                <th className="px-4 py-2">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-4">No hiring requests found.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-700">
                    <td className="px-4 py-2">{req.name}</td>
                    <td className="px-4 py-2">{req.phone}</td>
                    <td className="px-4 py-2">{req.email}</td>
                    <td className="px-4 py-2">{req.course}</td>
                    <td className="px-4 py-2">{req.sem_year || req.semYear}</td>
                    <td className="px-4 py-2">{req.position}</td>
                    <td className="px-4 py-2 whitespace-pre-line break-words max-w-xs" title={req.about}>{req.about}</td>
                    <td className="px-4 py-2"><a href={req.cv_link || req.cv} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">CV</a></td>
                    <td className="px-4 py-2">{req.submitted_at ? new Date(req.submitted_at).toLocaleString() : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminHiringRequests;
