import { useEffect, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { socket } from "../../sockets/socket";

export default function CodeEditor({
  roomId,
  code,
  activeTab,
  onCodeChange,
  onTabChange,
}) {
  const [internalTab, setInternalTab] = useState(activeTab || "html");
  const currentTab = activeTab || internalTab;

  useEffect(() => {
    if (activeTab) setInternalTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleCodeUpdate = ({ codeType, value }) => {
      if (onCodeChange) {
        onCodeChange((prev) => ({ ...prev, [codeType]: value }));
      }
    };

    socket.on("code-update", handleCodeUpdate);
    return () => {
      socket.off("code-update", handleCodeUpdate);
    };
  }, [onCodeChange]);

  const handleChange = useCallback(
    (value = "") => {
      if (onCodeChange)
        onCodeChange((prev) => ({ ...prev, [currentTab]: value }));

      socket.emit("code-change", {
        roomId,
        codeType: currentTab,
        value,
      });
    },
    [currentTab, onCodeChange, roomId]
  );

  const handleTabClick = (tab) => {
    if (onTabChange) onTabChange(tab);
    else setInternalTab(tab);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-white/10">
      {/* Editor Tabs */}
      <div className="flex bg-gray-800 text-gray-200 rounded-t-xl">
        {["html", "css", "js"].map((tab) => {
          const isActive = currentTab === tab;
          return (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`flex-1 px-4 py-2 text-sm font-medium capitalize transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                isActive
                  ? "bg-gray-700 text-white shadow-inner"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
              aria-pressed={isActive}
            >
              {tab.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Monaco Editor Instance */}
      <div className="flex-1 min-h-[300px] sm:min-h-[400px]">
        <Editor
          height="100%"
          language={currentTab === "js" ? "javascript" : currentTab}
          theme="vs-dark"
          value={code?.[currentTab] ?? ""}
          onChange={handleChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            wordWrap: "on",
            padding: { top: 10 },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
