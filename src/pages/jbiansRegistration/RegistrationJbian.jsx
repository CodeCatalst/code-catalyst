import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Phone,
  Hash,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Upload,
  Mail,
  Music,
  Building2,
} from "lucide-react";
import { toast } from "../../components/hooks/use-toast";
import * as XLSX from "xlsx";
import { createDanceSocietyRegistration } from "../../services/api";

const Registrationjbians = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUserId] = useState(
    "user-" + Math.random().toString(36).substr(2, 9)
  ); // Simulate user ID
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNo: "",
    erp: "",
    formOfDance: "",
    branch: "",
  });
  const formRef = useRef(null);

  useEffect(() => {
    // Fade in form on mount
    if (formRef.current) {
      setTimeout(() => {
        formRef.current.style.opacity = "1";
        formRef.current.style.transform = "translateY(0)";
      }, 300);
    }

    // Load submissions from localStorage
    const savedSubmissions = localStorage.getItem("danceRegistrations");
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadExcel = () => {
    if (submissions.length === 0) {
      toast({
        title: "No Data",
        description: "No registrations to export",
        variant: "destructive",
      });
      return;
    }

    // Prepare data for Excel
    const excelData = submissions.map((sub, index) => ({
      "S.No": index + 1,
      Name: sub.name,
      "WhatsApp Number": sub.whatsappNo,
      "ERP Number": sub.erp,
      "Submitted At": new Date(sub.submittedAt).toLocaleString(),
      "User ID": sub.userId,
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    // Download
    XLSX.writeFile(
      wb,
      `Dance_Society_Registrations_${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );

    toast({
      title: "Success",
      description: "Excel file downloaded successfully!",
    });
  };

  const deleteSubmission = (id) => {
    const updatedSubmissions = submissions.filter((sub) => sub.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem(
      "danceRegistrations",
      JSON.stringify(updatedSubmissions)
    );

    toast({
      title: "Success",
      description: "Registration deleted successfully",
    });
  };

  // Filter to show only current user's submissions
  const userSubmissions = submissions.filter(
    (sub) => sub.userId === currentUserId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.whatsappNo ||
      !formData.erp ||
      !formData.formOfDance ||
      !formData.branch
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(formData.whatsappNo)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit WhatsApp number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Submit to backend API
      await createDanceSocietyRegistration(formData);

      // Create new submission for local storage
      const newSubmission = {
        id: Date.now().toString(),
        userId: currentUserId,
        ...formData,
        submittedAt: new Date().toISOString(),
      };

      // Save to state and localStorage
      const updatedSubmissions = [...submissions, newSubmission];
      setSubmissions(updatedSubmissions);
      localStorage.setItem(
        "danceRegistrations",
        JSON.stringify(updatedSubmissions)
      );

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      toast({
        title: "Success",
        description: "Registration submitted successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        whatsappNo: "",
        erp: "",
        formOfDance: "",
        branch: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-950 via-red-950 to-yellow-950 py-12 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Sticky "Developed by CC" Tag */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://code-catalyst.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg hover:bg-black/90 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/10 hover:border-white/30 group"
        >
          <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
            Developed by
          </span>
          <div className="flex items-center gap-1.5">
            <img
              src="/logo_transparent.png"
              alt="CC Logo"
              className="h-5 w-5 object-contain transition-transform duration-500 group-hover:rotate-180"
            />
            <span className="text-sm font-bold">Code Catalyst</span>
          </div>
        </a>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-5 rounded-2xl shadow-2xl animate-fade-in backdrop-blur-sm border border-green-300/30">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3 backdrop-blur-sm">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Success!</p>
                <p className="text-sm text-green-50">
                  Registration submitted successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <img
              src="/jbianslogo.png"
              alt="JBIANS Dance Society"
              className="h-28 w-28 object-cover rounded-full drop-shadow-2xl relative z-10 transform hover:scale-110 transition-transform duration-500 border-4 border-white/30"
            />
          </div>
          <p className="text-lg md:text-xl text-orange-200 font-medium tracking-wide mb-2">
            JBians Dance Society Presents:
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">
            BREAK THE{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
              BEAT
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-orange-300 drop-shadow-lg">
            DANCE BATTLE 2025 🔥
          </h2>

          {/* Download Rulebook Button */}
          <div className="mt-6 flex justify-center">
            <a
              href="/jbiansrulebook.pdf"
              download
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/30 hover:border-white/50 group"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              <span>Download Rulebook</span>
            </a>
          </div>
        </div>

        {/* Registration Form Card */}
        <div
          ref={formRef}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 opacity-0 transform translate-y-10 transition-all duration-700 border border-white/20 hover:shadow-orange-500/20 hover:shadow-3xl"
        >
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Name Field */}
            <div className="group">
              <label
                htmlFor="name"
                className="flex items-center text-white font-semibold mb-3 text-lg"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg mr-3 shadow-lg group-hover:shadow-orange-500/50 transition-all group-hover:scale-110">
                  <User className="w-5 h-5 text-white" />
                </div>
                Full Name{" "}
                <span className="text-yellow-400 ml-1 text-xl">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-orange-300/50 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30 transition-all outline-none hover:border-orange-400 hover:bg-white text-gray-800 font-medium placeholder:text-gray-400 shadow-lg"
              />
            </div>

            {/* Email Field */}
            <div className="group">
              <label
                htmlFor="email"
                className="flex items-center text-white font-semibold mb-3 text-lg"
              >
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-lg mr-3 shadow-lg group-hover:shadow-purple-500/50 transition-all group-hover:scale-110">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                Email Address{" "}
                <span className="text-yellow-400 ml-1 text-xl">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-purple-300/50 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/30 transition-all outline-none hover:border-purple-400 hover:bg-white text-gray-800 font-medium placeholder:text-gray-400 shadow-lg"
              />
            </div>

            {/* WhatsApp Number Field */}
            <div className="group">
              <label
                htmlFor="whatsappNo"
                className="flex items-center text-white font-semibold mb-3 text-lg"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg mr-3 shadow-lg group-hover:shadow-green-500/50 transition-all group-hover:scale-110">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                WhatsApp Number{" "}
                <span className="text-yellow-400 ml-1 text-xl">*</span>
              </label>
              <input
                type="tel"
                id="whatsappNo"
                name="whatsappNo"
                value={formData.whatsappNo}
                onChange={handleInputChange}
                required
                placeholder="10-digit mobile number"
                maxLength="10"
                pattern="\d{10}"
                className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-green-300/50 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/30 transition-all outline-none hover:border-green-400 hover:bg-white text-gray-800 font-medium placeholder:text-gray-400 shadow-lg"
              />
            </div>

            {/* ERP Field */}
            <div className="group">
              <label
                htmlFor="erp"
                className="flex items-center text-white font-semibold mb-3 text-lg"
              >
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-2 rounded-lg mr-3 shadow-lg group-hover:shadow-yellow-500/50 transition-all group-hover:scale-110">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                ERP Number{" "}
                <span className="text-yellow-400 ml-1 text-xl">*</span>
              </label>
              <input
                type="text"
                id="erp"
                name="erp"
                value={formData.erp}
                onChange={handleInputChange}
                required
                placeholder="Enter your ERP number"
                className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-yellow-300/50 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/30 transition-all outline-none hover:border-yellow-400 hover:bg-white text-gray-800 font-medium placeholder:text-gray-400 shadow-lg"
              />
            </div>

            {/* Form of Dance Field */}
            <div className="group">
              <label
                htmlFor="formOfDance"
                className="flex items-center text-white font-semibold mb-3 text-lg"
              >
                <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-2 rounded-lg mr-3 shadow-lg group-hover:shadow-pink-500/50 transition-all group-hover:scale-110">
                  <Music className="w-5 h-5 text-white" />
                </div>
                Form of Dance{" "}
                <span className="text-yellow-400 ml-1 text-xl">*</span>
              </label>
              <input
                type="text"
                id="formOfDance"
                name="formOfDance"
                value={formData.formOfDance}
                onChange={handleInputChange}
                required
                placeholder="e.g., Hip-Hop, Contemporary, Classical, etc."
                className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-pink-300/50 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/30 transition-all outline-none hover:border-pink-400 hover:bg-white text-gray-800 font-medium placeholder:text-gray-400 shadow-lg"
              />
            </div>

            {/* Branch Field */}
            <div className="group">
              <label
                htmlFor="branch"
                className="flex items-center text-white font-semibold mb-3 text-lg"
              >
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg mr-3 shadow-lg group-hover:shadow-cyan-500/50 transition-all group-hover:scale-110">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                Branch <span className="text-yellow-400 ml-1 text-xl">*</span>
              </label>
              <input
                type="text"
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                required
                placeholder="Enter your branch (e.g., CS, IT, ME, etc.)"
                className="w-full px-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-cyan-300/50 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/30 transition-all outline-none hover:border-cyan-400 hover:bg-white text-gray-800 font-medium placeholder:text-gray-400 shadow-lg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full md:col-span-2 relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white font-black py-5 px-8 rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 focus:outline-none focus:ring-4 focus:ring-orange-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl hover:shadow-orange-500/50 text-lg group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {loading ? (
                <span className="relative flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="relative flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Submit Registration
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registrationjbians;
