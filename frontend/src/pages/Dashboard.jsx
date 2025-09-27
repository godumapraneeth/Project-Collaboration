import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Create a new project
  const createRoom = async () => {
    try {
      const res = await api.post("/projects/create-room", { title: "Untitled Project" });
      const newProject = res.data.project;

      setProjects((prev) => [newProject, ...prev]);

      navigate(`/project/${newProject.roomId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create project");
    }
  };

  // Delete a project
  const handleDeleteProject = async (projectId, projectTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${projectTitle}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/projects/delete/${projectId}`);
      toast.success(`Project "${projectTitle}" deleted successfully!`);

      setProjects((curr) => curr.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  const updateProjectInState = (updatedProject) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">My Projects</h1>
          <button
            onClick={createRoom}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:from-purple-700 hover:to-indigo-700 transition transform hover:scale-105"
          >
            + New Project
          </button>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <div className="text-gray-500 col-span-full text-center py-10">
              You don't have any projects yet. Click "+ New Project" to get started!
            </div>
          ) : (
            projects.map((p) => (
              <div
                key={p._id}
                className="relative bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 group cursor-pointer"
                onClick={() => navigate(`/project/${p.roomId}`)}
              >
                <h2 className="font-semibold text-lg text-gray-900">{p.title || "Untitled"}</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "N/A"}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(p._id, p.title);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Delete project ${p.title}`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
