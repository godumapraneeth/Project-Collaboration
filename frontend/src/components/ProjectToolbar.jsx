import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const IconWrapper = ({ children }) => (
  <span className="inline-flex items-center mr-1.5">{children}</span>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
  </svg>
);
const LeaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
  </svg>
);

export default function ProjectToolbar({
  title,
  onSave,
  onUpdateTitle,
  saving,
  onLeave,
  ownerId,
  currentUserId,
}) {
  const { roomId } = useParams();
  const [localTitle, setLocalTitle] = useState(title);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localTitle !== title) {
        onUpdateTitle(localTitle);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localTitle, title, onUpdateTitle]);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const handleRun = () => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const newWindow = window.open(`${baseUrl}/projects/run/${roomId}`, "_blank");
    if (newWindow) newWindow.opener = null;
  };

  const isOwner = ownerId === currentUserId;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-b bg-white shadow-sm gap-3">
      {/* Project Title */}
      <input
        type="text"
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        className="text-lg font-semibold border-none focus:ring-0 focus:outline-none flex-1 min-w-[200px]"
        readOnly={!isOwner}
        placeholder="Enter project title..."
      />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRun}
          className="flex items-center px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
        >
          <IconWrapper><PlayIcon /></IconWrapper> Run
        </button>

        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <IconWrapper><SaveIcon /></IconWrapper> {saving ? "Saving..." : "Save"}
        </button>

        {!isOwner && (
          <button
            onClick={onLeave}
            className="flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            <IconWrapper><LeaveIcon /></IconWrapper> Leave
          </button>
        )}
      </div>
    </div>
  );
}
