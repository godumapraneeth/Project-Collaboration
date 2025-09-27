import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connectSocket, socket } from "../sockets/socket";
import ChatBox from "../components/Chat/ChatBox";
import CodeEditor from "../components/Editor/CodeEditor";
import Preview from "../components/Editor/Preview";
import ProjectToolbar from "../components/ProjectToolbar";
import InviteUserForm from "../components/InviteUserForm";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";
import { toast } from "react-toastify";

export default function ProjectRoom() {
  const { roomId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("html");
  const [project, setProject] = useState(null);
  const [liveCode, setLiveCode] = useState({ html: "<!-- HTML -->", css: "/* CSS */", js: "// JS" });
  const [saving, setSaving] = useState(false);
  const [loadingState, setLoadingState] = useState({ isLoading: true, error: null });
  const chatContainerRef = useRef();

  // -----------------------------
  // Fetch Project Data
  // -----------------------------
  useEffect(() => {
    const controller = new AbortController();
    const fetchProject = async () => {
      setLoadingState({ isLoading: true, error: null });
      try {
        const res = await api.get(`/projects/${roomId}`, { signal: controller.signal });
        const proj = res.data.project;
        setProject(proj);
        setLiveCode({ html: proj.html || "<!-- HTML -->", css: proj.css || "/* CSS */", js: proj.js || "// JS" });
        setLoadingState({ isLoading: false, error: null });
      } catch (err) {
        if (err.name !== "CanceledError") {
          setLoadingState({ isLoading: false, error: err });
          toast.error(err.response?.data?.message || "Failed to load project");
        }
      }
    };
    fetchProject();
    return () => controller.abort();
  }, [roomId]);

  // -----------------------------
  // Socket connection
  // -----------------------------
  useEffect(() => {
    if (!token || !roomId) return;

    const joinRoom = () => {
      console.log(`✅ Socket connected. Joining room: ${roomId}`);
      socket.emit("user-joined", { roomId });
    };

    connectSocket(token);

    if (socket.connected) joinRoom();
    else socket.on("connect", joinRoom);

    return () => {
      socket.emit("leave-room", { roomId });
      socket.off("connect", joinRoom);
    };
  }, [roomId, token]);

  // -----------------------------
  // Auto-scroll chat
  // -----------------------------
  const scrollChatToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  // -----------------------------
  // Save Project
  // -----------------------------
  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    try {
      const res=await api.post(`/projects/${roomId}/save`, {
        title: project.title,
        html: liveCode.html,
        css: liveCode.css,
        js: liveCode.js,
      });
      setProject(res.data.project)
      toast.success("Project saved!");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTitle = async (newTitle) => {
    const oldTitle = project.title;
    setProject((prev) => ({ ...prev, title: newTitle }));
    try {
      await api.put(`/projects/${roomId}/update-title`, { title: newTitle });
    } catch (err) {
      console.error("Failed to update title:", err);
      toast.error("Could not save title. Reverting change.");
      setProject((prev) => ({ ...prev, title: oldTitle }));
    }
  };


  const handleLeaveProject = async () => {
    if (!window.confirm("Are you sure you want to leave this project?")) return;
    try {
      await api.post(`/projects/${roomId}/leave`);
      toast.success("You have left the project.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to leave project:", err);
      toast.error(err.response?.data?.message || "Could not leave the project.");
    }
  };

  if (loadingState.isLoading)
    return (
      <div className="flex items-center justify-center h-screen animate-pulse text-gray-500 text-xl">
        Loading project...
      </div>
    );

  if (loadingState.error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <h2 className="text-2xl font-bold">Error Loading Project</h2>
        <p>{loadingState.error.response?.status === 404 ? "This project could not be found." : "An unexpected error occurred."}</p>
      </div>
    );

  const isOwner = project?.owner === user?._id;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Editor + Preview */}
      <div className="flex-1 flex flex-col">
        <ProjectToolbar
          title={project.title}
          onSave={handleSave}
          onUpdateTitle={handleUpdateTitle}
          saving={saving}
          onLeave={handleLeaveProject}
          ownerId={project.owner}
          currentUserId={user._id}
        />
        <div className="flex-1 grid grid-cols-2 gap-2 p-2">
          <CodeEditor
            roomId={roomId}
            code={liveCode}
            activeTab={activeTab}
            onCodeChange={setLiveCode}
            onTabChange={setActiveTab}
          />
          <Preview html={liveCode.html} css={liveCode.css} js={liveCode.js} />
        </div>
      </div>

      {/* Chat + Invite */}
      <div className="w-96 flex flex-col border-l bg-white">
        <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
          <ChatBox projectId={roomId} currentUser={user} onNewMessage={scrollChatToBottom} />
        </div>
        {isOwner && <InviteUserForm roomId={roomId} />}
      </div>
    </div>
  );
}
