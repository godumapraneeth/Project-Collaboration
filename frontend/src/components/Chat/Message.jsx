export default function Message({ message, currentUser }) {
  const isOwn = message.sender._id === currentUser._id;

  return (
    <div
      className={`flex items-end gap-2 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* Show avatar only for others */}
      {!isOwn && (
        <img
          src={
            message.sender.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              message.sender.name
            )}`
          }
          alt={`${message.sender.name} avatar`}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      {/* Message bubble */}
      <div
        className={`px-4 py-2 rounded-2xl max-w-[70%] shadow-sm ${
          isOwn
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-lg"
            : "bg-gray-200 text-gray-800 rounded-bl-lg"
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold mb-1 text-indigo-700">
            {message.sender.name}
          </p>
        )}
        <p className="text-sm break-words leading-relaxed">
          {message.message}
        </p>
        <p
          className={`text-xs mt-2 ${
            isOwn ? "text-indigo-100/80 text-right" : "text-gray-500 text-left"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
