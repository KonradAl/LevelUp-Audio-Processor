// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectOutputDirectory: () => ipcRenderer.invoke('select-output-directory'),
  processAudio: (files: string[], settings: any) => 
    ipcRenderer.invoke('process-audio', files, settings),
  cleanupTempFiles: (directoryPath: string) => 
    ipcRenderer.invoke('cleanup-temp-files', directoryPath),
  onProgress: (callback: any) => 
    ipcRenderer.on('progress-update', callback),
  onBatchProgress: (callback: any) => 
    ipcRenderer.on('batch-progress-update', callback)
});
