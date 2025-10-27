import React from 'react';

export default function Navbar({ theme, onToggleTheme, autosaveEnabled, onToggleAutosave, onOpenSaveLoad }) {
  return (
    <div className="w-full bg-gray-800 text-white dark:bg-gray-900 flex items-center justify-between px-4 py-3 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="text-2xl font-bold">CipherStudio</div>
      </div>

      <div className="flex items-center space-x-3">
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={autosaveEnabled} onChange={onToggleAutosave} className="form-checkbox h-4 w-4" />
          <span className="text-gray-200">Autosave</span>
        </label>

        <button onClick={onOpenSaveLoad} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm">
          Save / Load
        </button>

        <button onClick={onToggleTheme} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </div>
  );
}
