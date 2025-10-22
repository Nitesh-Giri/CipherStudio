import { useEffect, useRef } from 'react';
import { updateFile } from '../api'; // Import your API function

/**
 * @typedef {Object} File
 * @property {string} _id
 * @property {string} content
 * @property {string} name
 * @property {string} type
 */

/**
 * Custom hook to auto-save file content after a delay (debounce).
 *
 * @param {Object<string, string>} sandpackFiles - The current state of files from Sandpack (e.g., { '/App.js': 'code...' }).
 * @param {File[]} originalFiles - The original file list from the database.
 * @param {string} activeFile - The path of the currently active file (e.g., "/App.js").
 * @param {number} [delay=2000] - The debounce delay in milliseconds (default: 2 seconds).
 */
export const useAutoSave = (sandpackFiles, originalFiles, activeFile, delay = 2000) => {
  // Use a ref to store the latest file content without re-triggering the effect
  const sandpackFilesRef = useRef(sandpackFiles);

  // Update the ref whenever sandpackFiles changes
  useEffect(() => {
    sandpackFilesRef.current = sandpackFiles;
  }, [sandpackFiles]);

  useEffect(() => {
    // Set up the timer
    const timerId = setTimeout(() => {
      // Find the corresponding file from the database
      const dbFile = originalFiles.find(f => `/${f.name}` === activeFile);
      
      // Get the current content from Sandpack
      const currentContent = sandpackFilesRef.current[activeFile];

      // Check if the file exists and the content has actually changed
      if (dbFile && currentContent !== dbFile.content) {
        console.log(`Auto-saving ${activeFile}...`);
        
        updateFile(dbFile._id, currentContent)
          .then(response => {
            console.log(`File ${activeFile} saved successfully.`);
            // You could optionally update the 'originalFiles' state here
            // to prevent re-saving, but it's complex.
            // For now, we just log success.
          })
          .catch(err => {
            console.error(`Failed to auto-save ${activeFile}:`, err);
            // You could show a toast notification to the user here
          });
      }
    }, delay);

    // This is the cleanup function.
    // It runs when the dependencies (activeFile, delay) change or when the component unmounts.
    // This cancels the previous timer, ensuring we only save after the *last* change.
    return () => {
      clearTimeout(timerId);
    };
  }, [activeFile, delay, originalFiles]); // Re-run effect if the active file or delay changes
};

// Export as a default or named export based on your preference
export default useAutoSave;

