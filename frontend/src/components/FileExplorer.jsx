import React from 'react';

export default function FileExplorer({ files, onFileSelect, activeFile, onCreateFile, onDeleteFile, onRenameFile }) {
  const codeFiles = files.filter(f => f.type === 'file');

  return (
    <div className="w-60 h-full bg-gray-800 text-gray-300 p-4 overflow-y-auto border-r border-gray-700 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">Files</h4>
        <div className="space-x-2">
          <button onClick={() => onCreateFile && onCreateFile()} className="text-sm bg-green-600 px-2 py-1 rounded hover:bg-green-700">Add</button>
          <button onClick={() => onDeleteFile && onDeleteFile(activeFile)} className="text-sm bg-red-600 px-2 py-1 rounded hover:bg-red-700">Delete</button>
        </div>
      </div>

      <ul className="space-y-2 flex-1 overflow-auto">
        {codeFiles.map(file => {
          const isActive = activeFile === `/${file.name}`;
          
          return (
            <li
              key={file._id}
              onClick={() => onFileSelect(file.name)}
              className={`
                px-3 py-2 text-sm rounded-md cursor-pointer transition-colors
                break-words
                ${isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'hover:bg-gray-700'
                }
              `}
            >
              {file.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

