# LevelUp Audio Normalization App - Features Overview

## Core Functionality
LevelUp is an Electron-based audio normalization application that uses FFmpeg's loudnorm filter to achieve precise LUFS (Loudness Units relative to Full Scale) targeting for professional audio processing.

## Key Features

### 1. Multi-Pass Iterative Normalization
- **2-5 Pass Processing**: Configurable number of passes for maximum accuracy
- **Adaptive Stopping**: Automatically stops when target accuracy is achieved (±0.1 LUFS default)
- **Smart Improvement Detection**: Stops early if no improvement detected between passes
- **Linear Mode**: Uses `linear=true` for precise LUFS targeting in FFmpeg loudnorm filter

### 2. High-Precision Audio Analysis
- **Robust Parameter Extraction**: Multiple regex patterns for reliable loudnorm analysis parsing
- **Validation System**: Ensures all required parameters are extracted before processing
- **Accuracy Reporting**: Shows target vs actual LUFS values with error calculations
- **Verification Mode**: Post-processing analysis to confirm results

### 3. Parallel Processing for Large Batches
- **Automatic Detection**: Sequential for ≤3 files, parallel for >3 files
- **Worker Pool System**: Uses (CPU cores - 1) workers for optimal performance
- **Batch Performance**: Up to 7x faster processing for large audio libraries
- **Individual Error Handling**: Failed files don't stop other workers
- **Progress Tracking**: Real-time progress across all parallel operations

### 4. Advanced Configuration Options
- **Target LUFS**: Precise loudness targeting (-23 to -16 LUFS typical range)
- **Custom LRA**: Loudness Range targeting for dynamic control
- **Dual Mono Processing**: Enhanced accuracy for stereo content
- **Peak Limiting**: True Peak limiting with configurable thresholds
- **Accuracy Threshold**: Configurable stopping criteria (0.05-0.5 LUFS)
- **Concurrent Jobs**: Adjustable parallel worker count

### 5. Professional Audio Compliance
- **EBU R128 Standard**: Full compliance with broadcast loudness standards
- **True Peak Detection**: Prevents inter-sample peaks and digital distortion
- **Loudness Range Control**: Maintains or adjusts dynamic range as needed
- **Integrated Loudness**: Accurate measurement across entire audio duration

### 6. User Experience Features
- **Drag & Drop Interface**: Easy file selection and batch processing
- **Real-time Progress**: Live updates during processing with detailed status
- **Error Recovery**: Graceful handling of corrupted or unsupported files
- **Temporary File Management**: Automatic cleanup of intermediate processing files
- **Batch Summary**: Comprehensive reports after processing completion

## Technical Architecture

### Audio Processing Pipeline
1. **Initial Analysis**: FFmpeg loudnorm filter extracts audio characteristics
2. **Parameter Validation**: Ensures all required values are available
3. **First Pass**: Applies loudnorm with extracted parameters
4. **Verification**: Measures actual output loudness
5. **Iterative Refinement**: Additional passes if accuracy threshold not met
6. **Final Validation**: Confirms target achievement

### File Processing Modes
- **Sequential**: For small batches (≤3 files), ensures system stability
- **Parallel**: For large batches (>3 files), maximizes throughput
- **Hybrid**: Falls back to sequential if parallel processing encounters issues

### Supported Formats
- **Input**: WAV, FLAC, MP3, M4A, OGG, and other FFmpeg-supported formats
- **Output**: WAV (default), with configurable format options
- **Bit Depth**: Maintains original or configurable output bit depth
- **Sample Rate**: Preserves original sample rate

## Performance Characteristics

### Accuracy Expectations
- **Standard Mode**: ±0.1 LUFS typical accuracy
- **Multi-Pass Mode**: ±0.05 LUFS achievable accuracy
- **Convergence**: Usually achieved within 2-3 passes

### Speed Performance
- **Single File**: ~1-3x real-time depending on file complexity
- **Batch Processing**: Up to 7x faster with parallel processing
- **Large Libraries**: 500+ files processed efficiently with worker pools

### System Requirements
- **CPU**: Multi-core processor recommended for parallel processing
- **Memory**: 4GB+ RAM for large batch operations
- **Storage**: Temporary space equal to 2x largest file size
- **OS**: Windows, macOS, Linux (Electron cross-platform)

## Use Cases

### Professional Audio Production
- Album mastering for streaming platforms
- Podcast loudness normalization
- Broadcast content preparation
- Music library standardization

### Content Creation
- YouTube video audio normalization
- Social media content optimization
- Audiobook production
- Voice-over normalization

### Audio Libraries
- Large music collection standardization
- Archive digitization projects
- Radio station content preparation
- Streaming service optimization

## Configuration Management
All settings are persistent and user-configurable through the application interface, with professional defaults that work for most use cases while allowing fine-tuning for specific requirements. 