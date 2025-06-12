import React, { useState, useEffect } from 'react';
import { AppState, AudioFile, NormalizationSettings } from '../interfaces';
import DragZone from './DragZone';
import SettingsPanel from './SettingsPanel';
import ProcessingQueue from './ProcessingQueue';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    files: [],
    settings: {
      targetLUFS: -21,
      truePeakLimit: -9,
      twoPassNormalization: true,
      outputFormat: 'mp3',
      preserveMetadata: true,
      useHighQualityMode: false,
      preserveOriginalFormat: false, // Default to false, user can enable for format preservation
      // Advanced options for maximum accuracy
      maxPasses: 3,           // Try up to 3 passes for better accuracy
      accuracyThreshold: 0.1, // Stop when within 0.1 LUFS of target
      // Parallel processing for large batches
      enableParallelProcessing: true,  // Auto-enable for batches >3 files
      maxConcurrentJobs: undefined     // Auto-detect: CPU cores - 1
    },
    isProcessing: false,
    progress: 0
  });

  useEffect(() => {
    // Setup progress listener
    window.electronAPI.onProgress((event, data) => {
      setState(prevState => {
        const updatedFiles = prevState.files.map(file => {
          if (file.path === data.filePath) {
            // If there's an error, mark the file as error
            if (data.error) {
              return {
                ...file,
                status: 'error' as const,
                error: data.error
              };
            }
            
            // Otherwise update progress
            return {
              ...file,
              status: data.percent === 100 ? 'complete' as const : 'processing' as const
            };
          }
          return file;
        });

        return {
          ...prevState,
          files: updatedFiles,
          progress: data.percent || prevState.progress
        };
      });
    });
  }, []);

  const handleFilesSelected = async (paths: string[]) => {
    try {
      // Validate and filter out invalid paths
      const validPaths = paths.filter(path => path && typeof path === 'string');
      
      if (validPaths.length === 0) {
        console.warn('No valid file paths were provided');
        return;
      }
      
      // Convert file paths to AudioFile objects
      const newFiles = validPaths.map(path => {
        // Extract filename safely
        let name = 'Unknown';
        try {
          // Handle different path separators (/ or \)
          if (path.includes('/')) {
            name = path.split('/').pop() || 'Unknown';
          } else if (path.includes('\\')) {
            name = path.split('\\').pop() || 'Unknown';
          } else {
            name = path; // If no separators, use the full path as name
          }
        } catch (err) {
          console.error('Error extracting filename:', err);
        }
        
        return {
          id: uuidv4(),
          name,
          path,
          size: 0, // Size will be determined later if needed
          status: 'pending' as const
        } as AudioFile;
      });

      setState(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    } catch (error) {
      console.error('Error handling selected files:', error);
    }
  };

  const handleSettingsChange = (newSettings: NormalizationSettings) => {
    setState(prev => ({
      ...prev,
      settings: newSettings
    }));
  };

  const handleProcessFiles = async () => {
    if (state.files.length === 0) return;

    setState(prev => ({
      ...prev,
      isProcessing: true
    }));

    try {
      const filePaths = state.files
        .filter(file => file.status !== 'complete' && file.path)
        .map(file => file.path);

      if (filePaths.length === 0) {
        setState(prev => ({
          ...prev,
          isProcessing: false
        }));
        return;
      }

      await window.electronAPI.processAudio(filePaths, state.settings);

      setState(prev => ({
        ...prev,
        isProcessing: false
      }));
    } catch (error) {
      console.error('Error processing files:', error);
      
      // Mark files as error
      setState(prev => {
        const updatedFiles = prev.files.map(file => {
          if (file.status === 'processing') {
            return {
              ...file,
              status: 'error' as const,
              error: 'Processing failed'
            };
          }
          return file;
        });
        
        return {
          ...prev,
          files: updatedFiles,
          isProcessing: false
        };
      });
    }
  };

  const handleRemoveFile = (id: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter(file => file.id !== id)
    }));
  };

  return (
    <div className="app-container">
      <h1>LevelUp</h1>
      <p>Drag audio files to normalize LUFS levels</p>
      
      <DragZone onFilesSelected={handleFilesSelected} />
      
      <SettingsPanel
        settings={state.settings}
        onSettingsChange={handleSettingsChange}
      />
      
      <ProcessingQueue
        files={state.files}
        isProcessing={state.isProcessing}
        onProcessFiles={handleProcessFiles}
        onRemoveFile={handleRemoveFile}
      />
    </div>
  );
};

export default App; 