import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";
import { toast } from "react-toastify";

import CodeEditor from "../components/Editor/CodeEditor";
import Preview from "../components/Editor/Preview";
import Collabarators from "../components/Editor/Collaborators";
import ProjectToolbar from "../components/ProjectToolbar";

export default function Editor() {
  const { roomId } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("html");
  const [liveCode, setLiveCode] = useState({
    html: "<!-- HTML -->",
    css: "/* CSS */",
    js: "// JS",
  });
  const [saving, setSaving] = useState(false);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${roomId}`);
        const proj = res.data.project;
        setProject(proj);
        setLiveCode({
          html: proj.html || "<!-- HTML -->",
          css: proj.css || "/* CSS */",
          js: proj.js || "// JS",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project");
      }
    };
    fetchProject();
  }, [roomId]);

  // Save project
  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    try {
      const res = await api.post("/projects/save", {
        roomId,
        title: project.title,
        html: liveCode.html,
        css: liveCode.css,
        js: liveCode.js,
      });
      setProject(res.data.project);
      toast.success("Project saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  // Update project title
  const updateTitle = async (title) => {
    try {
      await api.put("/projects/update-title", { roomId, title });
      setProject((prev) => ({ ...prev, title }));
      toast.success("Title updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update title");
    }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <ProjectToolbar
        title={project.title}
        onSave={handleSave}
        onUpdateTitle={updateTitle}
        saving={saving}
        ownerId={project.owner?._id}
        currentUserId={project.currentUserId}
      />

      {/* Editor + Preview */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex-1 border rounded-lg overflow-hidden shadow-sm bg-white">
            <CodeEditor
              roomId={roomId}
              code={liveCode}
              activeTab={activeTab}
              onCodeChange={setLiveCode}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Preview & Collaborators */}
        <div className="w-1/2 flex flex-col gap-2">
          <div className="flex-1 border rounded-lg overflow-hidden shadow-sm bg-white">
            <Preview html={liveCode.html} css={liveCode.css} js={liveCode.js} />
          </div>
          <Collabarators participants={project.participants || []} />
        </div>
      </div>
    </div>
  );
}
