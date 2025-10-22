import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sandpack } from '@codesandbox/sandpack-react';
import { getProject } from '../api';
import FileExplorer from '../components/FileExplorer';
import useAutoSave from '../hooks/useAutoSave'; // Import the custom hook

/**
 * The main IDE interface, combining the file explorer,
 * code editor, and live preview.
 */
export default function IDEPage() {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [files, setFiles] = useState([]);
  const [sandpackFiles, setSandpackFiles] = useState({});
  const [activeFile, setActiveFile] = useState('/App.js');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 4. Use the auto-save hook
  // This hook will handle all the saving logic automatically
  useAutoSave(sandpackFiles, files, activeFile);

  // 5. Handle file selection from the explorer
  const handleFileSelect = (fileName) => {
    setActiveFile(`/${fileName}`);
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
    <div className="flex h-screen w-screen bg-gray-900">
      {/* File Explorer */}
      <FileExplorer
        files={files}
        onFileSelect={handleFileSelect}
        activeFile={activeFile}
      />
      
      {/* Sandpack Editor & Preview */}
      <div className="flex-1 h-full overflow-hidden">
        <Sandpack
          // The 'key' is crucial to force Sandpack to re-mount
          // when the files are first loaded asynchronously
          key={projectId}
          template="react"
          files={sandpackFiles}
          activeFile={activeFile}
          onActiveFileChange={setActiveFile}
          onCodeUpdate={(newFiles) => setSandpackFiles(newFiles)}
          options={{
            showTabs: true,
            showLineNumbers: true,
            wrapContent: true,
            showNavigator: true,
            editorHeight: '100vh', // Make editor fill the vertical space
          }}
          theme="dark"
        />
      </div>
    </div>
  );
}

