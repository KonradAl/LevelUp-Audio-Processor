import React from 'react';
import { AudioFile } from '../interfaces';

interface ProcessingQueueProps {
  files: AudioFile[];
  isProcessing: boolean;
  onProcessFiles: () => void;
  onRemoveFile: (id: string) => void;
}

const ProcessingQueue: React.FC<ProcessingQueueProps> = ({ 
  files, 
  isProcessing, 
  onProcessFiles, 
  onRemoveFile 
}) => {
  const getStatusText = (file: AudioFile) => {
    switch (file.status) {
      case 'pending':
        return 'Ready to process';
      case 'processing':
        return 'Processing...';
      case 'complete':
        return 'Complete ✓';
      case 'error':
        return file.error || 'Error';
      default:
        return file.status;
    }
  };

  const getStatusClass = (status: string) => {
    return `status-badge ${status}`;
  };

  return (
    <div className="processing-queue">
      <h3>Processing Queue</h3>
      
      {files.length === 0 ? (
        <p className="empty-queue">No files selected</p>
      ) : (
        <>
          <div className="file-list">
            {files.map(file => (
              <div key={file.id} className={`file-item ${file.status === 'error' ? 'has-error' : ''}`}>
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className={getStatusClass(file.status)}>
                    {getStatusText(file)}
                  </span>
                </div>
                <button 
                  className="remove-file"
                  onClick={() => onRemoveFile(file.id)}
                  disabled={isProcessing && file.status === 'processing'}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="queue-actions">
            <button 
              className="process-button"
              onClick={onProcessFiles}
              disabled={isProcessing || files.length === 0 || files.every(f => f.status === 'complete')}
            >
              {isProcessing ? 'Processing...' : 'Process Files'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProcessingQueue; 