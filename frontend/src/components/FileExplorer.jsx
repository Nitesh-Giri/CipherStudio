import React from 'react';

export default function FileExplorer({ files, onFileSelect, activeFile }) {
  
  const codeFiles = files.filter(f => f.type === 'file');

  return (
    <div className="w-60 h-full bg-gray-800 text-gray-300 p-4 overflow-y-auto border-r border-gray-700">
      <h4 className="text-lg font-semibold text-white mb-4">Files</h4>
      <ul className="space-y-2">
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

