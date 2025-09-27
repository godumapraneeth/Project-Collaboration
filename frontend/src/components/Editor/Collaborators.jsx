export default function Collaborators({ participants = [] }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center gap-2">
        👥 Collaborators
      </h3>
      {participants.length > 0 ? (
        <ul className="space-y-2">
          {participants.map((p) => (
            <li
              key={p.user?._id || Math.random()}
              className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="font-medium text-gray-700">{p.user?.name}</span>
              <span className="text-xs px-2 py-1 rounded-md bg-indigo-100 text-indigo-600 font-semibold">
                {p.role}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No collaborators yet</p>
      )}
    </div>
  );
}
