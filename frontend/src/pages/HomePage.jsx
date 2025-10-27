import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateProject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await createProject('My New Project');
      navigate(`/project/${data.projectId}`);
    } catch (err) {
      console.error('Failed to create project', err);
      setError('Could not create a new project. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-10">
        {/* Left Projects Column */}
        <aside className="w-80 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4" />
              </svg>
              <h2 className="text-xl font-semibold">Projects</h2>
            </div>
            <button onClick={handleCreateProject} disabled={isLoading} className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
              +
            </button>
          </div>

          <div className="text-gray-400">No projects yet. Create one to get started!</div>
        </aside>

        {/* Center content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-6xl opacity-30 mb-6">&lt;/&gt;</div>
            <h1 className="text-4xl font-bold mb-2">Welcome to CipherStudio</h1>
            <p className="text-gray-300 mb-6">Create or select a project to start coding</p>

            <ul className="text-gray-400 space-y-2">
              <li>Build React applications right in your browser</li>
              <li>Live preview as you code</li>
              <li>Projects saved automatically to the cloud</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

