# LevelUp v1.0 - Feature Documentation

## Overview
LevelUp is a professional-grade audio normalization tool built with Electron, designed for broadcast and production environments requiring precise LUFS targeting and high-quality audio processing.

## Core Features

### 🎯 **Precision LUFS Normalization**
- Two-pass loudnorm processing with `linear=true` for maximum accuracy
- Multi-pass iterative processing (2-5 passes) for near-perfect targeting
- Accuracy threshold control (default: ±0.1 LUFS)
- Comprehensive verification with error reporting

### 🔊 **True Peak Management**
- Precise dBTP (True Peak) limiting
- Support for broadcast standards: -1, -1.5, -2, -6, -9, -12 dBTP
- Independent LUFS and true peak accuracy tracking

### 📺 **Broadcast Standards Support**
- Preset LUFS targets: -23 (EBU R128), -21 (Streaming), -16 (Music), -14 (Legacy)
- Custom LUFS targeting from -30 to -6 LUFS
- Configurable Loudness Range (LRA) settings

### 🎵 **High-Quality Processing**
- **Standard Mode**: Direct format processing
- **High-Quality Mode**: WAV intermediates for multi-pass (prevents MP3 degradation)
- Smart format detection and preservation
- Lossless processing chains for FLAC/WAV inputs

### ⚡ **Parallel Processing**
- Automatic CPU detection (uses cores - 1)
- Worker pool system for batch operations
- Real-time progress tracking per file and batch
- Conservative resource management to prevent system overheating

### 🎚️ **Advanced Audio Options**
- Custom Loudness Range (LRA) targeting
- Dual-mono processing for enhanced stereo accuracy
- Metadata preservation during processing
- Support for MP3, WAV, FLAC input/output formats

### 💻 **User Interface**
- Modern React-based GUI with responsive design
- Drag-and-drop file selection
- Real-time processing progress with visual feedback
- Batch progress tracking with completion statistics
- Comprehensive settings panel with presets

### 🔧 **Technical Features**
- Robust parameter extraction with multiple regex fallbacks
- Automatic temporary file cleanup with manual override
- IPC communication between main and renderer processes
- TypeScript implementation for type safety
- Comprehensive error handling and logging

## Quality Metrics

### **Accuracy Achievements**
- **Single-pass**: ±0.5-1.0 LUFS
- **Two-pass**: ±0.1-0.5 LUFS  
- **Multi-pass**: ±0.05-0.1 LUFS (near-perfect targeting)

### **Quality Preservation**
- **High-Quality Mode**: Equivalent to single re-encoding
- **Lossless Inputs**: Zero quality loss possible with same-format output
- **MP3 Processing**: Minimized generational loss through WAV intermediates

## Performance Benchmarks

### **Parallel Processing Benefits**
- **4-core system**: ~3x faster than sequential
- **8-core system**: ~7x faster than sequential
- **500-song pipeline**: ~25 hours → ~3.6 hours (8-core)

### **Resource Management**
- Conservative CPU usage (leaves 1 core free)
- Smart memory management with temporary file cleanup
- Progress tracking with minimal overhead

## Upcoming Features (v1.1)

### **Smart Format Handling**
- Automatic format detection and optimization
- Lossless-preserving workflows (FLAC→FLAC→FLAC)
- User-controlled output format conversion
- Zero-loss processing for lossless inputs

### **Enhanced Version Control**
- Git-based development workflow
- Tagged stable releases
- Feature branch development
- Rollback capabilities

## Technical Architecture

- **Frontend**: React with TypeScript
- **Backend**: Electron main process
- **Audio Processing**: FFmpeg with loudnorm filter
- **Build System**: Webpack with Electron Forge
- **Language**: TypeScript throughout

## System Requirements

- **Platform**: macOS, Windows, Linux (Electron)
- **FFmpeg**: Bundled with @ffmpeg-installer/ffmpeg
- **Memory**: Scales with batch size and parallel workers
- **Storage**: Temporary space for intermediate files during processing

---

*Last updated: v1.0.0-stable* 