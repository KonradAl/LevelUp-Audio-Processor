# LevelUp - Parallel Processing for Large Batches

## Overview

Your LevelUp app now supports parallel processing for large batches! This is perfect for your 500-song pipeline and will dramatically reduce processing time while keeping your system responsive.

## How It Works

### Automatic Detection
- **Small batches (≤3 files)**: Uses sequential processing
- **Large batches (>3 files)**: Automatically enables parallel processing
- **Worker count**: Automatically uses CPU cores - 1 (leaves one core for system)

### Worker Pool System
```
Queue: [Song1, Song2, Song3, Song4, Song5, ...]

Worker 1: Song1 → Song4 → Song7 → ...
Worker 2: Song2 → Song5 → Song8 → ...  
Worker 3: Song3 → Song6 → Song9 → ...
```

Each worker processes songs independently using the full loudnorm pipeline (including multi-pass if enabled).

## Performance Benefits

### Expected Speed Improvements
- **4-core system**: ~3x faster (3 workers)
- **8-core system**: ~7x faster (7 workers)
- **16-core system**: ~15x faster (15 workers)

### Real-World Example (500 songs)
```
Sequential: 500 songs × 2 minutes = 16.7 hours
Parallel (8 cores): 500 songs × 2 minutes ÷ 7 workers = ~2.4 hours
```

## Configuration Options

### Default Settings (Recommended)
```typescript
settings = {
  enableParallelProcessing: true,  // Auto-enable for batches >3 files
  maxConcurrentJobs: undefined    // Auto-detect: CPU cores - 1
}
```

### Custom Configuration
```typescript
// Force specific number of workers
maxConcurrentJobs: 4  // Use exactly 4 workers

// Disable parallel processing
enableParallelProcessing: false  // Always use sequential

// Conservative (leave more CPU for system)
maxConcurrentJobs: Math.max(1, os.cpus().length - 2)  // Leave 2 cores free
```

## System Resource Management

### CPU Usage
- **Automatic**: Uses CPU cores - 1 by default
- **Conservative**: Set `maxConcurrentJobs` to half your cores for lighter load
- **Aggressive**: Set to CPU cores (use with caution on older systems)

### Memory Usage
- Each worker loads one audio file at a time
- FFmpeg processes are independent and memory-isolated
- Typical usage: ~50-100MB per worker

### Disk I/O
- Workers read from different source files simultaneously
- Temporary files are managed per-worker to avoid conflicts
- Output files are written independently

## Console Output

### Batch Start
```
=== BATCH PROCESSING START ===
Files to process: 500
Parallel processing: ENABLED
Max concurrent jobs: 7
Using parallel processing with 7 workers...
```

### Worker Activity
```
Worker 1 started
Worker 2 started
Worker 3 started
...
Worker 1 processing job 1/500: Song001.mp3
Worker 2 processing job 2/500: Song002.mp3
Worker 1 completed job 1/500 (1/500 total completed)
Worker 3 processing job 3/500: Song003.mp3
```

### Batch Summary
```
=== PARALLEL PROCESSING SUMMARY ===
Total files: 500
Completed: 497
Failed: 3
Success rate: 99.4%
=== BATCH PROCESSING COMPLETE ===
```

## Error Handling

### Individual File Failures
- Failed files don't stop other workers
- Errors are logged per-worker
- UI shows failed files with error messages
- Processing continues for remaining files

### Worker Management
- If a worker crashes, others continue processing
- Failed jobs are reported but don't block the queue
- Graceful handling of FFmpeg errors per file

## Best Practices for Large Batches

### 1. System Preparation
```bash
# For 500+ song batches, ensure adequate:
# - Free disk space (2x total input size)
# - Available RAM (500MB+ for large batches)
# - Stable power source for long operations
```

### 2. Optimal Settings for Large Batches
```typescript
// Recommended for 500-song pipeline
settings = {
  enableParallelProcessing: true,
  maxConcurrentJobs: undefined,  // Auto-detect
  twoPassNormalization: true,    // Keep quality high
  maxPasses: 2,                  // Limit passes for speed
  accuracyThreshold: 0.2,        // Slightly relax accuracy for speed
  outputFormat: 'mp3'            // Faster encoding than FLAC
}
```

### 3. Progress Monitoring
- Individual file progress: Shows per-file completion
- Batch progress: Shows overall completion (X/500 files)
- Time estimates: Based on completed files vs remaining
- Error tracking: Real-time failure count and success rate

## Troubleshooting

### High CPU Usage
```typescript
// Reduce worker count
maxConcurrentJobs: Math.max(1, os.cpus().length - 2)
```

### Memory Issues
```typescript
// Process smaller batches
// Split 500 songs into 5 batches of 100 each
```

### Slow Network Storage
```typescript
// Disable parallel for network drives
enableParallelProcessing: false
```

### System Responsiveness
```typescript
// Leave more cores free
maxConcurrentJobs: Math.max(2, os.cpus().length / 2)
```

## Performance Monitoring

### What to Watch
- **CPU usage**: Should be high but not 100% sustained
- **Memory usage**: Should remain stable, not growing
- **Disk activity**: High during processing is normal
- **Temperature**: Monitor if processing very large batches

### Expected Timeline (500 songs, ~3-4 min each)
- **8-core system**: ~4-6 hours total
- **4-core system**: ~8-10 hours total  
- **2-core system**: Better to use sequential processing

The parallel processing will make your 500-song pipeline much more manageable! 