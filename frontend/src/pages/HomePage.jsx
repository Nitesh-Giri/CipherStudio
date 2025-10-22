import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api'; 

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
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-blue-400">CipherStudio</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Your lightweight, in-browser React IDE.
        </p>
        
        <button
          onClick={handleCreateProject}
          disabled={isLoading}
          className={`
            w-full px-6 py-3 text-lg font-semibold text-white rounded-md
            transition-colors duration-200
            ${isLoading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          `}
        >
          {isLoading ? 'Creating Project...' : 'Start a New Project'}
        </button>

        {error && (
          <p className="text-red-400 mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}

