import React, { useState, useEffect } from 'react'
import { Download, Trash2, User, Phone, Hash, Calendar, RefreshCw, Mail, Music, Building2 } from 'lucide-react'
import { toast } from '../../components/hooks/use-toast'
import * as XLSX from 'xlsx'
import { getDanceRegistrations, deleteDanceRegistration, getDanceRegistrationStats } from '../../services/api'

const JbiansAdmin = () => {
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubmissions()
    loadStats()
  }, [])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const response = await getDanceRegistrations()
      if (response.success && response.data) {
        setSubmissions(response.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load submissions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await getDanceRegistrationStats()
      if (response.success && response.stats) {
        setStats(response.stats)
      }
    } catch (error) {
      // Don't show error toast for stats, as it's not critical
    }
  }

  const downloadExcel = () => {
    if (submissions.length === 0) {
      toast({
        title: "No Data",
        description: "No registrations to export",
        variant: "destructive",
      })
      return
    }

    try {
      // Prepare data for Excel
      const excelData = submissions.map((sub, index) => ({
        'S.No': index + 1,
        'Name': sub.name,
        'Email': sub.email,
        'WhatsApp Number': sub.whatsappNo,
        'ERP Number': sub.erp,
        'Form of Dance': sub.form_of_dance,
        'Branch': sub.branch,
        'Submitted At': new Date(sub.created_at).toLocaleString(),
      }))

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'JBIANS Registrations')

      // Download
      XLSX.writeFile(wb, `JBIANS_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`)
      
      toast({
        title: "Success",
        description: "Excel file downloaded successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download Excel file",
        variant: "destructive",
      })
    }
  }

  const deleteSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await deleteDanceRegistration(id)
        
        // Remove from local state
        setSubmissions(prevSubmissions => prevSubmissions.filter(sub => sub.id !== id))
        
        // Reload stats
        loadStats()
        
        toast({
          title: "Success",
          description: "Registration deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete registration",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-red-950 to-yellow-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                JBIANS Registration <span className="bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">Admin Panel</span>
              </h1>
              <p className="text-orange-200 text-lg">Manage dance society registrations</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  loadSubmissions()
                  loadStats()
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <button
                onClick={downloadExcel}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Excel
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <p className="text-orange-200 text-sm font-medium">Total Registrations</p>
              <p className="text-3xl font-black text-white mt-1">
                {stats?.total || submissions.length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <p className="text-green-200 text-sm font-medium">Recent (Last 7 Days)</p>
              <p className="text-3xl font-black text-white mt-1">
                {stats?.recent || 0}
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <p className="text-blue-200 text-sm font-medium">Latest Registration</p>
              <p className="text-lg font-bold text-white mt-1">
                {submissions.length > 0 
                  ? new Date(submissions[0].created_at).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-orange-500"></div>
            <p className="text-white mt-4 text-lg">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20 text-center">
            <User className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <p className="text-white text-xl font-bold">No registrations yet</p>
            <p className="text-orange-200 mt-2">Registrations will appear here once submitted</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <div
                key={submission.id}
                className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl hover:border-white/30 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Serial Number */}
                  <div className="lg:col-span-1 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-orange-200 text-xs font-medium">Full Name</p>
                        <p className="text-white text-lg font-bold">{submission.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-lg">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-purple-200 text-xs font-medium">Email</p>
                          <p className="text-white font-semibold text-sm">{submission.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-green-200 text-xs font-medium">WhatsApp</p>
                          <p className="text-white font-semibold">{submission.whatsappNo}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-2 rounded-lg">
                          <Hash className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-yellow-200 text-xs font-medium">ERP Number</p>
                          <p className="text-white font-semibold">{submission.erp}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-2 rounded-lg">
                          <Music className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-pink-200 text-xs font-medium">Form of Dance</p>
                          <p className="text-white font-semibold">{submission.form_of_dance}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 p-2 rounded-lg">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-cyan-200 text-xs font-medium">Branch</p>
                          <p className="text-white font-semibold">{submission.branch}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-lg">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-200 text-xs font-medium">Submitted At</p>
                          <p className="text-white font-semibold">
                            {new Date(submission.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-4 flex flex-col gap-3">
                    <button
                      onClick={() => deleteSubmission(submission.id)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JbiansAdmin
