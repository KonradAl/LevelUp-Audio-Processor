import React, { useState, useRef } from 'react';

interface DragZoneProps {
  onFilesSelected: (paths: string[]) => void;
}

const DragZone: React.FC<DragZoneProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDropError(null);

    try {
      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) {
        setDropError("No files were dropped");
        return;
      }
      
      // Filter for audio files
      const audioFiles = files.filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(ext || '');
      });

      if (audioFiles.length === 0) {
        setDropError("No supported audio files found. Please use MP3, WAV, FLAC, AAC, M4A, or OGG files.");
        return;
      }

      // Try multiple methods to get file paths
      const validPaths: string[] = [];

      for (const file of audioFiles) {
        let filePath: string | null = null;
        
        try {
          // Method 1: Try the path property (works in Electron for local files)
          filePath = (file as any).path;
          
          // Method 2: Try webkitRelativePath
          if (!filePath && file.webkitRelativePath) {
            filePath = file.webkitRelativePath;
          }
          
          // Method 3: Use the file name as fallback (won't work for processing but at least shows the file)
          if (!filePath && file.name) {
            // This is a fallback - we'll need to handle this case differently
            console.log('Using file name as fallback:', file.name);
            filePath = file.name;
          }
          
          if (filePath && typeof filePath === 'string') {
            validPaths.push(filePath);
            console.log('Successfully got file path:', filePath);
          }
        } catch (err) {
          console.error('Error accessing file path for', file.name, ':', err);
        }
      }

      if (validPaths.length > 0) {
        console.log('Drag and drop successful, paths:', validPaths);
        onFilesSelected(validPaths);
      } else {
        console.error('Could not get any valid file paths from dropped files');
        setDropError("Could not access file paths. This might be due to browser security restrictions. Please use the 'Select Files' button instead.");
      }
    } catch (error) {
      console.error('Error handling dropped files:', error);
      setDropError("An error occurred while processing the dropped files");
    }
  };

  const handleButtonClick = async () => {
    setDropError(null);
    try {
      const filePaths = await window.electronAPI.selectFiles();
      if (filePaths && Array.isArray(filePaths) && filePaths.length > 0) {
        onFilesSelected(filePaths);
      } else {
        setDropError("No files were selected");
      }
    } catch (error) {
      console.error('Error selecting files:', error);
      setDropError("An error occurred while selecting files");
    }
  };

  return (
    <div 
      ref={dropZoneRef}
      className={`drag-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3>Drag audio files here</h3>
      <p>or</p>
      <button onClick={handleButtonClick}>Select Files</button>
      
      {dropError && <p className="error-message">{dropError}</p>}
    </div>
  );
};

export default DragZone; 