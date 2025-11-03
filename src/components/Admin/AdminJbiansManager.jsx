import React, { useState, useEffect } from 'react'
import { Download, Eye, Trash2, User, Phone, Hash, Calendar, X, RefreshCw } from 'lucide-react'
import { toast } from '../hooks/use-toast'
import * as XLSX from 'xlsx'

const AdminJbiansManager = () => {
  const [submissions, setSubmissions] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = () => {
    setLoading(true)
    try {
      const savedSubmissions = localStorage.getItem('danceRegistrations')
      if (savedSubmissions) {
        setSubmissions(JSON.parse(savedSubmissions))
      }
    } catch (error) {
      console.error('Error loading submissions:', error)
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
        'WhatsApp Number': sub.whatsappNo,
        'ERP Number': sub.erp,
        'Submitted At': new Date(sub.submittedAt).toLocaleString(),
        'User ID': sub.userId
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
      console.error('Error downloading Excel:', error)
      toast({
        title: "Error",
        description: "Failed to download Excel file",
        variant: "destructive",
      })
    }
  }

  const deleteSubmission = (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        const updatedSubmissions = submissions.filter(sub => sub.id !== id)
        setSubmissions(updatedSubmissions)
        localStorage.setItem('danceRegistrations', JSON.stringify(updatedSubmissions))
        
        toast({
          title: "Success",
          description: "Registration deleted successfully",
        })
      } catch (error) {
        console.error('Error deleting submission:', error)
        toast({
          title: "Error",
          description: "Failed to delete registration",
          variant: "destructive",
        })
      }
    }
  }

  const viewImage = (imageData) => {
    setSelectedImage(imageData)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              JBIANS Dance Society Registrations
            </h2>
            <p className="text-gray-400">Manage dance society registration submissions</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadSubmissions}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={downloadExcel}
              disabled={submissions.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-orange-500/10 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20">
            <p className="text-orange-300 text-sm font-medium">Total Registrations</p>
            <p className="text-3xl font-black text-white mt-1">{submissions.length}</p>
          </div>
          <div className="bg-green-500/10 backdrop-blur-sm p-4 rounded-xl border border-green-500/20">
            <p className="text-green-300 text-sm font-medium">With Payment Proof</p>
            <p className="text-3xl font-black text-white mt-1">
              {submissions.filter(s => s.paymentScreenshot).length}
            </p>
          </div>
          <div className="bg-blue-500/10 backdrop-blur-sm p-4 rounded-xl border border-blue-500/20">
            <p className="text-blue-300 text-sm font-medium">Latest Registration</p>
            <p className="text-lg font-bold text-white mt-1">
              {submissions.length > 0 
                ? new Date(submissions[submissions.length - 1].submittedAt).toLocaleDateString()
                : 'N/A'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl p-12 border border-slate-800 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-orange-500"></div>
          <p className="text-gray-400 mt-4 text-lg">Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl p-12 border border-slate-800 text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-white text-xl font-bold">No registrations yet</p>
          <p className="text-gray-400 mt-2">Registrations will appear here once submitted</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <div
              key={submission.id}
              className="bg-slate-900/50 backdrop-blur-xl rounded-xl shadow-xl p-6 border border-slate-800 hover:border-slate-700 transition-all"
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
                      <p className="text-gray-400 text-xs font-medium">Full Name</p>
                      <p className="text-white text-lg font-bold">{submission.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-medium">WhatsApp</p>
                        <p className="text-white font-semibold">{submission.whatsappNo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-2 rounded-lg">
                        <Hash className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-medium">ERP Number</p>
                        <p className="text-white font-semibold">{submission.erp}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-medium">Submitted At</p>
                      <p className="text-white font-semibold">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  {submission.paymentScreenshot && (
                    <button
                      onClick={() => viewImage(submission.paymentScreenshot)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      View Payment Screenshot
                    </button>
                  )}

                  <button
                    onClick={() => deleteSubmission(submission.id)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Payment Screenshot"
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border-4 border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminJbiansManager
