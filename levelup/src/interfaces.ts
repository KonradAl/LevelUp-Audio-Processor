export interface AudioFile {
  id: string;
  name: string;
  path: string;
  size: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
  error?: string;
  outputPath?: string;
}

export interface NormalizationSettings {
  targetLUFS: number;
  truePeakLimit: number; // dBTP (True Peak) - more precise than basic dBFS
  twoPassNormalization: boolean;
  outputFormat: 'mp3' | 'wav' | 'flac';
  preserveMetadata: boolean;
  outputDirectory?: string;
  // Advanced options for precise targeting
  customLRA?: number; // Custom Loudness Range target (default: 11 LU)
  useDualMono?: boolean; // Use dual-mono processing for better accuracy (may cause issues with mono files)
  // Iterative normalization for maximum accuracy
  maxPasses?: number; // Maximum number of passes (default: 2, max: 5)
  accuracyThreshold?: number; // Stop when error is below this value in LUFS (default: 0.1)
  // Parallel processing for large batches
  maxConcurrentJobs?: number; // Number of files to process simultaneously (default: CPU cores - 1)
  enableParallelProcessing?: boolean; // Enable parallel processing for batches (default: true when >3 files)
  // Quality preservation for multi-pass processing
  useHighQualityMode?: boolean; // Use WAV intermediates for multi-pass to preserve quality (default: false)
  // Format preservation mode
  preserveOriginalFormat?: boolean; // Keep original format (FLAC→FLAC, MP3→MP3, etc.) and force 3-pass processing
}

export interface AppState {
  files: AudioFile[];
  settings: NormalizationSettings;
  isProcessing: boolean;
  progress: number;
}

export interface ProgressData {
  filePath: string;
  percent: number;
  error?: string;
}

export interface BatchProgressData {
  completed: number;
  failed: number;
  total: number;
  overallProgress: number;
}

export interface ElectronAPI {
  selectFiles: () => Promise<string[]>;
  selectOutputDirectory: () => Promise<string | null>;
  processAudio: (files: string[], settings: NormalizationSettings) => Promise<void>;
  cleanupTempFiles: (directoryPath: string) => Promise<{success: boolean, message: string, count?: number}>;
  onProgress: (callback: (event: any, data: ProgressData) => void) => void;
  onBatchProgress: (callback: (event: any, data: BatchProgressData) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
} 