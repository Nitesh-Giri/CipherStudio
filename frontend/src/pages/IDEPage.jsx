import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sandpack } from '@codesandbox/sandpack-react';
import { getProject, createFile as apiCreateFile, updateFile as apiUpdateFile, deleteFile as apiDeleteFile, renameFile as apiRenameFile, saveSnapshot, listSnapshots, restoreSnapshot } from '../api';
import FileExplorer from '../components/FileExplorer';
import SaveLoadModal from '../components/SaveLoadModal';
import Navbar from '../components/Navbar';
import useAutoSave from '../hooks/useAutoSave'; // Import the custom hook

export default function IDEPage() {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [files, setFiles] = useState([]);
  const [sandpackFiles, setSandpackFiles] = useState({});
  const [activeFile, setActiveFile] = useState('/App.js');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('cipherstudio:theme') || 'dark');
  const [autosaveEnabled, setAutosaveEnabled] = useState(
    JSON.parse(localStorage.getItem('cipherstudio:autosaveEnabled') || 'true')
  );

  // 1. Fetch project data on load
  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await getProject(projectId);
        setProjectData(data.project);
        setFiles(data.files);

        // 2. Format files for Sandpack
        // Sandpack needs an object like: { '/App.js': 'file content' }
        const formattedFiles = data.files
          .filter(f => f.type === 'file')
          .reduce((acc, file) => {
            const path = `/${file.name}`;
            acc[path] = file.content;
            return acc;
          }, {});

        setSandpackFiles(formattedFiles);

        // 3. Set the default active file
        if (formattedFiles['/App.js']) {
          setActiveFile('/App.js');
        } else {
          // Fallback to the first file if App.js doesn't exist
          setActiveFile(Object.keys(formattedFiles)[0] || '/');
        }
      } catch (err) {
        console.error('Failed to load project', err);
        setError('Could not load your project. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  // Create a new file in the project
  const handleCreateFile = async () => {
    try {
      const inputName = window.prompt('Enter file name (include extension, e.g. MyComponent.js)');
      if (!inputName) return;
      const name = inputName.trim();
      // Basic validation: no slashes
      if (name.includes('/') || name.includes('\\')) {
        alert('Invalid file name. Do not include slashes.');
        return;
      }
      // Check duplicate
      if (files.find(f => f.name === name)) {
        alert('A file with that name already exists. Choose another name.');
        return;
      }

      const defaultContent = `export default function ${name.replace(/\.[^/.]+$/, '')}() {\n  return <div>New file</div>;\n}`;
      const { data } = await apiCreateFile({ projectId, name, type: 'file', content: defaultContent });
      // Refresh project files
      const { data: refreshed } = await getProject(projectId);
      setFiles(refreshed.files);
      setSandpackFiles(prev => ({ ...prev, [`/${data.file.name}`]: data.file.content }));
      setActiveFile(`/${data.file.name}`);
    } catch (err) {
      console.error('Failed to create file', err);
      alert('Failed to create file. See console for details.');
    }
  };

  const handleDeleteFile = async (filePath) => {
    if (!filePath) return;
    const fileName = filePath.replace(/\//g, '');
    const file = files.find(f => f.name === fileName);
    if (!file) return;
    try {
      await apiDeleteFile(file._id);
      const { data } = await getProject(projectId);
      setFiles(data.files);
      // Remove from sandpack files
      setSandpackFiles(prev => {
        const copy = { ...prev };
        delete copy[filePath];
        return copy;
      });
      setActiveFile(Object.keys(sandpackFiles)[0] || '/');
    } catch (err) {
      console.error('Failed to delete file', err);
    }
  };

  const handleRenameFile = async (filePath) => {
    if (!filePath) return;
    const fileName = filePath.replace(/\//g, '');
    const file = files.find(f => f.name === fileName);
    if (!file) return;

    const newName = window.prompt('Enter new file name', file.name);
    if (!newName || newName === file.name) return;

    try {
      const { data } = await apiRenameFile(file._id, newName);
      const refreshed = await getProject(projectId);
      setFiles(refreshed.data.files);
      // Update sandpack files key
      setSandpackFiles(prev => {
        const copy = { ...prev };
        const oldKey = `/${file.name}`;
        const newKey = `/${data.file.name}`;
        copy[newKey] = copy[oldKey];
        delete copy[oldKey];
        return copy;
      });
      setActiveFile(`/${data.file.name}`);
    } catch (err) {
      console.error('Failed to rename file', err);
    }
  };

  // 4. Use the auto-save hook (respect autosaveEnabled)
  // This hook will handle all the saving logic automatically
  useAutoSave(sandpackFiles, files, activeFile, 2000, { enabled: autosaveEnabled });

  // Theme toggle handler
  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('cipherstudio:theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // Autosave toggle handler
  const handleToggleAutosave = () => {
    const newVal = !autosaveEnabled;
    setAutosaveEnabled(newVal);
    localStorage.setItem('cipherstudio:autosaveEnabled', JSON.stringify(newVal));
  };

  // Load from localStorage if available (keyed by projectId)
  useEffect(() => {
    if (!projectId) return;
    try {
      const saved = localStorage.getItem(`cipherstudio:${projectId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setSandpackFiles(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load local project data', err);
    }
  }, [projectId]);

  // Save sandpack files to localStorage on change (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(`cipherstudio:${projectId}`, JSON.stringify(sandpackFiles));
      } catch (err) {
        console.warn('Failed to save project locally', err);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [sandpackFiles, projectId]);

  // 5. Handle file selection from the explorer
  const handleFileSelect = (fileName) => {
    setActiveFile(`/${fileName}`);
  };

  // Save the full project snapshot (files + sandpackFiles) to localStorage
  const handleSaveProject = () => {
    try {
      const snapshot = { files, sandpackFiles, savedAt: new Date().toISOString() };
      localStorage.setItem(`cipherstudio:${projectId}:snapshot`, JSON.stringify(snapshot));
      alert('Project snapshot saved locally.');
    } catch (err) {
      console.error('Failed to save project snapshot', err);
      alert('Failed to save snapshot.');
    }
  };

  // Load the snapshot from localStorage (if exists)
  const handleLoadProject = async () => {
    try {
      const raw = localStorage.getItem(`cipherstudio:${projectId}:snapshot`);
      if (!raw) return alert('No saved snapshot found for this project.');
      const parsed = JSON.parse(raw);
      if (!parsed) return alert('Invalid snapshot.');

      // Overwrite sandpackFiles and files state with the snapshot
      setSandpackFiles(parsed.sandpackFiles || {});
      setFiles(parsed.files || []);
      setActiveFile(Object.keys(parsed.sandpackFiles || {})[0] || '/');
      alert('Project snapshot loaded.');
    } catch (err) {
      console.error('Failed to load project snapshot', err);
      alert('Failed to load snapshot.');
    }
  };

  // Server snapshot helpers
  const handleSaveToServer = async (pid) => {
    try {
      const payload = { projectId: pid, data: { files, sandpackFiles } };
      const res = await saveSnapshot(payload);
      alert('Snapshot saved to server');
      return res;
    } catch (err) {
      console.error('Failed to save snapshot to server', err);
      alert('Failed to save snapshot to server');
    }
  };

  const handleListServer = (pid) => {
    return listSnapshots(pid);
  };

  const handleRestoreServer = async (snapshotId) => {
    try {
      await restoreSnapshot(snapshotId);
      // Reload project from server
      const { data } = await getProject(projectId);
      setFiles(data.files);
      const formattedFiles = data.files.filter(f => f.type === 'file').reduce((acc, file) => {
        acc[`/${file.name}`] = file.content;
        return acc;
      }, {});
      setSandpackFiles(formattedFiles);
      setActiveFile(Object.keys(formattedFiles)[0] || '/');
      alert('Snapshot restored from server');
    } catch (err) {
      console.error('Failed to restore snapshot from server', err);
      alert('Failed to restore snapshot');
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading Your Project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900">
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} autosaveEnabled={autosaveEnabled} onToggleAutosave={handleToggleAutosave} onOpenSaveLoad={() => setShowSaveLoad(true)} />


      {/* Main content: File explorer (left) and editor/preview (right) */}
  <div className="flex flex-1 h-full min-h-0">
        {/* File Explorer */}
        <FileExplorer
          files={files}
          onFileSelect={handleFileSelect}
          activeFile={activeFile}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteFile}
        />

       
  <div className="flex-1 h-full overflow-hidden min-h-0">
       
        <Sandpack
          key={projectId}
          template="react"
          files={Object.keys(sandpackFiles || {}).length > 0 ? sandpackFiles : {
            '/App.js': `import React from 'react';\nexport default function App(){\n  return (\n    <div style={{padding:20,color:'#cbd5e1'}}>\n      <h2>CipherStudio</h2>\n      <p>Add files from the left panel or click "Add" to create a new file.</p>\n    </div>\n  );\n}`,
            '/package.json': JSON.stringify({
              name: 'cipherstudio-sandbox',
              dependencies: {
                react: '18.2.0',
                'react-dom': '18.2.0'
              }
            }, null, 2)
          }}
          activeFile={activeFile}
          onActiveFileChange={(file) => {
            // guard: ensure active file exists
            setActiveFile(file || Object.keys(sandpackFiles || {})[0] || '/App.js');
          }}
          onCodeUpdate={(newFiles) => setSandpackFiles(newFiles)}
          options={{
            showTabs: true,
            showLineNumbers: true,
            wrapContent: true,
            showNavigator: true,
            showPreview: true,
            editorHeight: '60vh',
          }}
          theme="dark"
        />
      </div>
      </div>

      {showSaveLoad && (
        <SaveLoadModal
          projectId={projectId}
          onClose={() => setShowSaveLoad(false)}
          onSaveLocal={handleSaveProject}
          onLoadLocal={handleLoadProject}
          onSaveToServer={handleSaveToServer}
          onListServer={handleListServer}
          onRestoreServer={handleRestoreServer}
        />
      )}
    </div>
  );
}

