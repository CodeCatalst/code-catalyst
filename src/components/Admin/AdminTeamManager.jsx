import React, { useState, useEffect } from "react";
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../../services/team";
import Toast from "../Common/Toast";

const emptyMember = {
  name: "",
  role: "",
  department: "",
  image: "",
  bio: "",
  skills: [],
  social: {},
};

const AdminTeamManager = ({ onClose, onChange }) => {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMember);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeamMembers();

      // Parse skills and social fields for all members
      const parsedMembers = res.data.map((m) => {
        let parsedSocial = {};
        if (m.social) {
          if (typeof m.social === "string") {
            try {
              parsedSocial = JSON.parse(m.social);
            } catch {
              parsedSocial = {};
            }
          } else if (typeof m.social === "object") {
            parsedSocial = m.social;
          }
        }

        return {
          ...m,
          skills:
            typeof m.skills === "string"
              ? m.skills
                ? m.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : []
              : Array.isArray(m.skills)
              ? m.skills
              : [],
          social: parsedSocial,
        };
      });

      setMembers(parsedMembers);
    } catch (e) {
      setError(
        `Failed to load team members: ${
          e.response?.data?.error || e.message || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    let parsedSocial = {};
    if (member.social) {
      if (typeof member.social === "string") {
        try {
          parsedSocial = JSON.parse(member.social);
        } catch {
          parsedSocial = {};
        }
      } else if (typeof member.social === "object") {
        parsedSocial = member.social;
      }
    }

    setEditing(member.id);
    setForm({
      ...member,
      skills: Array.isArray(member.skills)
        ? member.skills
        : typeof member.skills === "string"
        ? member.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      social: parsedSocial,
    });
    setImagePreview(member.image || null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setToast({ message: 'Please select an image file', type: 'error' });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to compress image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 800px width/height for profile images)
          let width = img.width;
          let height = img.height;
          const maxDimension = 800;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression (0.85 quality for JPEG)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          
          // Validate size (should be under 500KB after compression)
          const base64Data = compressedBase64.split(',')[1];
          const sizeInBytes = Math.ceil(base64Data.length * 3 / 4);
          if (sizeInBytes > 500 * 1024) {
            setToast({ message: 'Image too large even after compression. Please use a smaller image.', type: 'error' });
            return;
          }
          
          setForm(prev => ({ ...prev, image: compressedBase64 }));
          setImagePreview(compressedBase64);
        };
        img.onerror = () => {
          setToast({ message: 'Failed to load image', type: 'error' });
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        setToast({ message: 'Failed to read file', type: 'error' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await deleteTeamMember(id);
      setToast({ message: "Team member deleted.", type: "success" });
      fetchMembers();
      onChange && onChange();
    } catch {
      setToast({ message: "Failed to delete team member.", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.name || !form.role) {
      setToast({
        message: "Name and role are required fields.",
        type: "error",
      });
      return;
    }

    // Convert skills array to comma-separated string for backend
    const submitForm = {
      ...form,
      skills: Array.isArray(form.skills) ? form.skills.join(",") : "",
      social: typeof form.social === "object" ? form.social : {},
    };

    try {
      if (editing) {
        await updateTeamMember(editing, submitForm);
        setToast({
          message: "Team member updated successfully.",
          type: "success",
        });
      } else {
        await addTeamMember(submitForm);
        setToast({
          message: "Team member added successfully.",
          type: "success",
        });
      }
      setEditing(null);
      setForm(emptyMember);
      setImagePreview(null);
      fetchMembers();
      onChange && onChange();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to save team member.";
      setToast({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="p-4">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-between">
        Manage Team Members
        <button
          className="ml-4 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 text-base"
          type="button"
          onClick={fetchMembers}
          title="Refresh"
        >
          ⟳ Refresh
        </button>
      </h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow mb-6">
            <table className="w-full text-left border-collapse bg-gray-800">
              <thead className="bg-gray-900 text-primary-400">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Skills</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr
                    key={m.id}
                    className={
                      editing === m.id
                        ? "bg-primary-900/30"
                        : "hover:bg-gray-700/50"
                    }
                  >
                    <td className="px-4 py-2 font-semibold text-white">
                      {m.name}
                    </td>
                    <td className="px-4 py-2 text-white">{m.role}</td>
                    <td className="px-4 py-2 text-white">{m.department}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {(m.skills || []).map((s, i) => (
                          <span
                            key={i}
                            className="bg-primary-700 text-white px-2 py-0.5 rounded text-xs"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Remove Modal, show update form inline below table */}
          <div className="max-w-xl mx-auto bg-gray-900 rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-primary-400">
              {editing ? "Update" : "Add"} Team Member
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="flex-1 p-2 rounded bg-gray-800 text-white"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
                <input
                  className="flex-1 p-2 rounded bg-gray-800 text-white"
                  placeholder="Role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <input
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder="Department"
                  value={form.department}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, department: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 rounded bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-700"
                    />
                  </div>
                )}
              </div>
              <textarea
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Bio"
                value={form.bio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bio: e.target.value }))
                }
              />
              <input
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Skills (comma separated)"
                value={form.skills.join(", ")}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  }))
                }
              />
              <div className="space-y-2">
                <input
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder="GitHub URL"
                  value={form.social?.github || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      social: { ...f.social, github: e.target.value },
                    }))
                  }
                />
                <input
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder="LinkedIn URL"
                  value={form.social?.linkedin || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      social: { ...f.social, linkedin: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="flex gap-2 justify-end">
                {editing && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditing(null);
                      setForm(emptyMember);
                      setImagePreview(null);
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all"
                >
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTeamManager;
