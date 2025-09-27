import { useState } from "react";

export default function ProfileForm({ user, onSave }) {
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setError("");
    onSave({ name, avatar });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>

      {/* Name field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 placeholder-gray-400"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Avatar field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Avatar URL
        </label>
        <input
          type="url"
          className="border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 placeholder-gray-400"
          placeholder="Paste image URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </div>

      {/* Avatar preview */}
      {avatar && (
        <div className="flex items-center gap-3 mt-2">
          <img
            src={avatar}
            alt="Avatar preview"
            className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow-sm"
          />
          <p className="text-sm text-gray-500">Preview</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </p>
      )}

      {/* Save button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:from-indigo-700 hover:to-purple-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Save Changes
      </button>
    </form>
  );
}
