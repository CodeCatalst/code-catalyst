import React, { useState, useEffect } from 'react';
import { getEsportsRegistrations, deleteEsportsRegistration } from '../../services/api';
import { useToast } from '../hooks/use-toast';
import * as XLSX from 'xlsx';
import Modal from '../Common/Modal';

const AdminEsportsManager = () => {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSport, setFilterSport] = useState('');
  const [filterTeamSize, setFilterTeamSize] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'json'

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [registrations, filterSport, filterTeamSize]);

  const fetchRegistrations = async () => {
    try {
      const data = await getEsportsRegistrations();
      setRegistrations(data);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch esports registrations';
      toast({
        title: "Error",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = registrations;

    if (filterSport) {
      filtered = filtered.filter(reg => reg.sport === filterSport);
    }

    if (filterTeamSize) {
      const teamSize = parseInt(filterTeamSize);
      filtered = filtered.filter(reg => {
        const members = reg.team_members ? JSON.parse(reg.team_members) : [];
        return members.length + 1 === teamSize; // +1 for the main registrant
      });
    }

    setFilteredRegistrations(filtered);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      await deleteEsportsRegistration(id);
      setRegistrations(registrations.filter(reg => reg.id !== id));
      toast({
        title: "Success",
        description: "Registration deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete registration"
      });
    }
  };

  const handleViewFull = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const exportToExcel = () => {
    const data = filteredRegistrations.map(reg => {
      const baseData = {
        'Registration ID': reg.id,
        'Team Captain': reg.name,
        'Email': reg.email,
        'Phone': reg.phone || 'N/A',
        'Captain Game ID': reg.game_id || 'N/A',
        'Game': reg.sport,
        'Submitted At': new Date(reg.submitted_at).toLocaleString()
      };

      // Add team member columns
      const teamMembers = reg.team_members ? JSON.parse(reg.team_members) : [];
      const maxMembers = 4; // Maximum team members based on filter options

      for (let i = 0; i < maxMembers; i++) {
        const member = teamMembers[i];
        if (member) {
          baseData[`Member ${i + 1} Name`] = member.name;
          baseData[`Member ${i + 1} Game User ID`] = member.gameUserId;
          baseData[`Member ${i + 1} In-Game Name`] = member.inGameName;
          baseData[`Member ${i + 1} ERP`] = member.erp || 'N/A';
        } else {
          baseData[`Member ${i + 1} Name`] = 'N/A';
          baseData[`Member ${i + 1} Game User ID`] = 'N/A';
          baseData[`Member ${i + 1} In-Game Name`] = 'N/A';
          baseData[`Member ${i + 1} ERP`] = 'N/A';
        }
      }

      baseData['Total Team Size'] = teamMembers.length + 1;

      return baseData;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Esports Registrations');

    // Auto-size columns for better readability
    const colWidths = [
      { wch: 12 }, // Registration ID
      { wch: 20 }, // Team Captain
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 15 }, // Captain Game ID
      { wch: 10 }, // Game
      { wch: 20 }, // Submitted At
      { wch: 20 }, // Member 1 Name
      { wch: 18 }, // Member 1 Game User ID
      { wch: 20 }, // Member 1 In-Game Name
      { wch: 12 }, // Member 1 ERP
      { wch: 20 }, // Member 2 Name
      { wch: 18 }, // Member 2 Game User ID
      { wch: 20 }, // Member 2 In-Game Name
      { wch: 12 }, // Member 2 ERP
      { wch: 20 }, // Member 3 Name
      { wch: 18 }, // Member 3 Game User ID
      { wch: 20 }, // Member 3 In-Game Name
      { wch: 12 }, // Member 3 ERP
      { wch: 20 }, // Member 4 Name
      { wch: 18 }, // Member 4 Game User ID
      { wch: 20 }, // Member 4 In-Game Name
      { wch: 12 }, // Member 4 ERP
      { wch: 15 }  // Total Team Size
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `esports_registrations_${filterSport || 'all'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Esports Registrations</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchRegistrations}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>🔄</span>
            Refresh
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Sport</label>
            <select
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
              className="bg-gray-700 text-gray-100 border border-gray-600 rounded px-3 py-2"
            >
              <option value="">All Sports</option>
              <option value="Freefire">Freefire</option>
              <option value="BGMI">BGMI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Team Size</label>
            <select
              value={filterTeamSize}
              onChange={(e) => setFilterTeamSize(e.target.value)}
              className="bg-gray-700 text-gray-100 border border-gray-600 rounded px-3 py-2"
            >
              <option value="">All Sizes</option>
              {[1, 2, 3, 4].map(size => (
                <option key={size} value={size}>{size} Member{size > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-gray-300">Email</th>
                <th className="px-4 py-3 text-left text-gray-300">Sport</th>
                <th className="px-4 py-3 text-left text-gray-300">Team Size</th>
                <th className="px-4 py-3 text-left text-gray-300">Submitted At</th>
                <th className="px-4 py-3 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map(reg => (
                <tr key={reg.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-3 text-gray-100">{reg.name}</td>
                  <td className="px-4 py-3 text-gray-100">{reg.email}</td>
                  <td className="px-4 py-3 text-gray-100">{reg.sport}</td>
                  <td className="px-4 py-3 text-gray-100">
                    {reg.team_members ? JSON.parse(reg.team_members).length + 1 : 1}
                  </td>
                  <td className="px-4 py-3 text-gray-100">
                    {reg.erp && <div className="text-xs text-gray-400">ERP: {reg.erp}</div>}
                    {new Date(reg.submitted_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleViewFull(reg)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(reg.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRegistrations.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No registrations found matching the filters.
        </div>
      )}

      {/* Full Response Modal */}
      {showModal && selectedRegistration && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-100">Full Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>ID:</strong> {selectedRegistration.id}</div>
              <div><strong>Name:</strong> {selectedRegistration.name}</div>
              <div><strong>Email:</strong> {selectedRegistration.email}</div>
              <div><strong>Phone:</strong> {selectedRegistration.phone || 'N/A'}</div>
              <div><strong>Game ID:</strong> {selectedRegistration.game_id || 'N/A'}</div>
              <div><strong>Sport:</strong> {selectedRegistration.sport}</div>
              <div><strong>Submitted At:</strong> {new Date(selectedRegistration.submitted_at).toLocaleString()}</div>
            </div>
            {selectedRegistration.team_members && (() => {
              const teamMembers = JSON.parse(selectedRegistration.team_members);
              return (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-100">Team Members:</h4>
                      <div className="text-sm text-gray-400 mt-1">
                        Total Members: {teamMembers.length} | Team Size: {teamMembers.length + 1}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          viewMode === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        List View
                      </button>
                      <button
                        onClick={() => setViewMode('json')}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          viewMode === 'json'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        JSON View
                      </button>
                    </div>
                  </div>

                {viewMode === 'list' ? (
                  <div className="space-y-3">
                    {JSON.parse(selectedRegistration.team_members).map((member, index) => (
                      <div key={index} className="bg-gray-700/50 border border-gray-600 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-400">
                            {index + 1}
                          </div>
                          <div className="font-semibold text-gray-100">{member.name}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div className="bg-gray-800/50 p-2 rounded">
                            <div className="text-gray-400">Game User ID</div>
                            <div className="text-gray-100 font-mono">{member.gameUserId}</div>
                          </div>
                          <div className="bg-gray-800/50 p-2 rounded">
                            <div className="text-gray-400">In-Game Name</div>
                            <div className="text-gray-100 font-mono">{member.inGameName}</div>
                          </div>
                          {member.erp && (
                            <div className="bg-gray-800/50 p-2 rounded">
                              <div className="text-gray-400">ERP</div>
                              <div className="text-gray-100 font-mono">{member.erp}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                      <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(teamMembers, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminEsportsManager;