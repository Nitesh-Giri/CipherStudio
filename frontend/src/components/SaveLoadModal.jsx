import React, { useEffect, useState } from 'react';

export default function SaveLoadModal({ projectId, onClose, onSaveToServer, onListServer, onRestoreServer, onSaveLocal, onLoadLocal }) {
  const [serverSnapshots, setServerSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await onListServer(projectId);
        // support both axios response shape and direct return
        const snaps = res?.data?.snapshots ?? res?.snapshots ?? [];
        setServerSnapshots(snaps || []);
      } catch (err) {
        console.warn('Failed to list server snapshots', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Save / Load Project</h3>
          <button onClick={onClose} className="text-sm text-gray-600">Close</button>
        </div>

        <div className="flex flex-col space-y-3 mb-4">
          <button onClick={onSaveLocal} className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Save Local</button>
          <button onClick={onLoadLocal} className="bg-gray-600 text-white py-2 rounded hover:bg-gray-500">Load Local</button>
          <button onClick={() => onSaveToServer(projectId)} className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Save to Server</button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Server Snapshots</h4>
          {loading ? <p>Loading...</p> : (
            <ul className="space-y-2 max-h-48 overflow-auto">
              {serverSnapshots.length === 0 && <li className="text-sm text-gray-500">No snapshots</li>}
              {serverSnapshots.map(s => (
                <li key={s._id} className="flex items-center justify-between border p-2 rounded">
                  <div>
                    <div className="text-sm">{new Date(s.createdAt).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">id: {s._id}</div>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => onRestoreServer(s._id)} className="text-sm bg-yellow-600 px-2 py-1 rounded hover:bg-yellow-700">Restore</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
