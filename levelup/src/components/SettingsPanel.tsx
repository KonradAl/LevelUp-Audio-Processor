import React, { useState } from 'react';
import { NormalizationSettings } from '../interfaces';

interface SettingsPanelProps {
  settings: NormalizationSettings;
  onSettingsChange: (newSettings: NormalizationSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const [usePreset, setUsePreset] = useState([-23, -21, -16, -14].includes(settings.targetLUFS));
  const [customLUFS, setCustomLUFS] = useState(settings.targetLUFS.toString());
  const [useTruePeakPreset, setUseTruePeakPreset] = useState([-1, -1.5, -2, -6, -9, -12].includes(settings.truePeakLimit));
  const [customTruePeak, setCustomTruePeak] = useState(settings.truePeakLimit.toString());
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState<string>('');

  const handlePresetLUFSChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value);
    onSettingsChange({
      ...settings,
      targetLUFS: newValue
    });
  };

  const handleCustomLUFSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomLUFS(value);
    
    const numValue = Number(value);
    // Validate LUFS range (typically between -50 and -6)
    if (!isNaN(numValue) && numValue >= -50 && numValue <= -6) {
      onSettingsChange({
        ...settings,
        targetLUFS: numValue
      });
    }
  };

  const handleLUFSModeChange = (preset: boolean) => {
    setUsePreset(preset);
    if (preset && ![-23, -21, -16, -14].includes(settings.targetLUFS)) {
      // Default to -16 when switching to preset mode
      const defaultValue = -16;
      setCustomLUFS(defaultValue.toString());
      onSettingsChange({
        ...settings,
        targetLUFS: defaultValue
      });
    }
  };

  const handlePresetTruePeakChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setCustomTruePeak(value.toString());
    onSettingsChange({
      ...settings,
      truePeakLimit: value
    });
  };

  const handleCustomTruePeakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomTruePeak(value);
    
    const numValue = Number(value);
    // Validate true peak range (typically between -20 and 0 for dBTP)
    if (!isNaN(numValue) && numValue >= -20 && numValue <= 0) {
      onSettingsChange({
        ...settings,
        truePeakLimit: numValue
      });
    }
  };

  const handleTruePeakModeChange = (preset: boolean) => {
    setUseTruePeakPreset(preset);
    if (preset && ![-1, -1.5, -2, -6, -9, -12].includes(settings.truePeakLimit)) {
      // Default to -1 when switching to preset mode
      const defaultValue = -1;
      setCustomTruePeak(defaultValue.toString());
      onSettingsChange({
        ...settings,
        truePeakLimit: defaultValue
      });
    }
  };

  const handleTwoPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      twoPassNormalization: e.target.checked
    });
  };

  const handleOutputFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      outputFormat: e.target.value as 'mp3' | 'wav' | 'flac'
    });
  };

  const handlePreserveMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      preserveMetadata: e.target.checked
    });
  };

  const handleSelectOutputDirectory = async () => {
    try {
      const selectedPath = await window.electronAPI.selectOutputDirectory();
      if (selectedPath) {
        onSettingsChange({
          ...settings,
          outputDirectory: selectedPath
        });
      }
    } catch (error) {
      console.error('Error selecting output directory:', error);
    }
  };

  const handleCleanupTempFiles = async () => {
    if (!settings.outputDirectory) {
      setCleanupMessage('❌ Please select an output directory first');
      setTimeout(() => setCleanupMessage(''), 3000);
      return;
    }

    setIsCleaningUp(true);
    setCleanupMessage('🧹 Cleaning up temporary files...');
    
    try {
      const result = await window.electronAPI.cleanupTempFiles(settings.outputDirectory);
      
      if (result.success) {
        setCleanupMessage(`✅ ${result.message}`);
      } else {
        setCleanupMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setCleanupMessage(`❌ Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCleaningUp(false);
      setTimeout(() => setCleanupMessage(''), 5000);
    }
  };

  const getDisplayPath = (path?: string) => {
    if (!path) return 'Default (Music/LevelUp)';
    // Show only the last 2 parts of the path if it's long
    const parts = path.split('/');
    if (parts.length > 2) {
      return `.../${parts.slice(-2).join('/')}`;
    }
    return path;
  };

  const handleHighQualityModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      useHighQualityMode: e.target.checked
    });
  };

  const handlePreserveOriginalFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      preserveOriginalFormat: e.target.checked
    });
  };

  return (
    <div className="settings-panel">
      <h3>Normalization Settings</h3>
      
      <div className="setting-group">
        <label>Target LUFS Level:</label>
        <div className="lufs-mode-selector">
          <label className="radio-label">
            <input 
              type="radio" 
              name="lufsMode" 
              checked={usePreset} 
              onChange={() => handleLUFSModeChange(true)}
            />
            Preset
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="lufsMode" 
              checked={!usePreset} 
              onChange={() => handleLUFSModeChange(false)}
            />
            Custom
          </label>
        </div>
        
        {usePreset ? (
          <select 
            id="targetLUFS" 
            value={settings.targetLUFS} 
            onChange={handlePresetLUFSChange}
          >
            <option value="-23">-23 LUFS (EBU Broadcast)</option>
            <option value="-21">-21 LUFS (Streaming Standard)</option>
            <option value="-16">-16 LUFS (Streaming)</option>
            <option value="-14">-14 LUFS (Commercial)</option>
          </select>
        ) : (
          <div className="custom-lufs-input">
            <input 
              type="number" 
              value={customLUFS}
              onChange={handleCustomLUFSChange}
              min="-50"
              max="-6"
              step="0.1"
              placeholder="e.g. -21"
            />
            <span className="lufs-unit">LUFS</span>
            <small className="lufs-range">Range: -50 to -6</small>
          </div>
        )}
      </div>

      <div className="setting-group">
        <label>True Peak Limit:</label>
        <div className="lufs-mode-selector">
          <label className="radio-label">
            <input 
              type="radio" 
              name="truePeakMode" 
              checked={useTruePeakPreset} 
              onChange={() => handleTruePeakModeChange(true)}
            />
            Preset
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="truePeakMode" 
              checked={!useTruePeakPreset} 
              onChange={() => handleTruePeakModeChange(false)}
            />
            Custom
          </label>
        </div>
        
        {useTruePeakPreset ? (
          <select 
            id="truePeakLimit" 
            value={settings.truePeakLimit} 
            onChange={handlePresetTruePeakChange}
          >
            <option value="-1">-1.0 dBTP (Streaming Standard)</option>
            <option value="-1.5">-1.5 dBTP (Conservative)</option>
            <option value="-2">-2.0 dBTP (Very Conservative)</option>
            <option value="-6">-6.0 dBTP (Safe)</option>
            <option value="-9">-9.0 dBTP (Very Safe)</option>
            <option value="-12">-12.0 dBTP (Ultra Safe)</option>
          </select>
        ) : (
          <div className="custom-lufs-input">
            <input 
              type="number" 
              value={customTruePeak}
              onChange={handleCustomTruePeakChange}
              min="-20"
              max="0"
              step="0.1"
              placeholder="e.g. -9.0"
            />
            <span className="lufs-unit">dBTP</span>
            <small className="lufs-range">Range: -20 to 0 dBTP</small>
          </div>
        )}
      </div>

      <div className="setting-group">
        <label htmlFor="twoPass">
          <input 
            type="checkbox" 
            id="twoPass" 
            checked={settings.twoPassNormalization} 
            onChange={handleTwoPassChange}
          />
          Two-Pass Normalization (More Accurate)
        </label>
        <small className="setting-description">
          Two-pass provides more accurate LUFS targeting but takes longer to process.
        </small>
      </div>

      <div className="setting-group high-quality-setting">
        <label htmlFor="highQuality">
          <input 
            type="checkbox" 
            id="highQuality" 
            checked={settings.useHighQualityMode || false} 
            onChange={handleHighQualityModeChange}
          />
          High-Quality Multi-Pass Mode
        </label>
        <small className="setting-description">
          Uses WAV intermediates during multi-pass processing to preserve audio quality.
          <br />
          <strong>Without:</strong> MP3 → MP3 → MP3 (quality loss)
          <br />
          <strong>With:</strong> MP3 → WAV → WAV → MP3 (quality preserved)
        </small>
      </div>

      <div className="setting-group format-preservation-setting">
        <label htmlFor="preserveOriginalFormat">
          <input 
            type="checkbox" 
            id="preserveOriginalFormat" 
            checked={settings.preserveOriginalFormat || false} 
            onChange={handlePreserveOriginalFormatChange}
          />
          Triple-Pass Format Preservation Mode
        </label>
        <small className="setting-description">
          Keeps original format (FLAC→FLAC, MP3→MP3, etc.) with automatic 3-pass processing for maximum accuracy.
          <br />
          <strong>Examples:</strong> FLAC in → FLAC out, MP3 in → MP3 out, WAV in → WAV out
          <br />
          <strong>Accuracy:</strong> ±0.05 LUFS targeting with format preservation
        </small>
      </div>
      
      <div className="setting-group">
        <label htmlFor="outputFormat">Output Format:</label>
        <select 
          id="outputFormat" 
          value={settings.outputFormat} 
          onChange={handleOutputFormatChange}
          disabled={settings.preserveOriginalFormat}
        >
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
          <option value="flac">FLAC</option>
        </select>
        {settings.preserveOriginalFormat && (
          <small className="setting-description" style={{marginTop: '5px', display: 'block'}}>
            Format selection disabled - using original file format
          </small>
        )}
      </div>

      <div className="setting-group">
        <label>Output Directory:</label>
        <div className="output-directory-selector">
          <button 
            type="button" 
            className="select-directory-btn"
            onClick={handleSelectOutputDirectory}
          >
            Choose Folder
          </button>
          <span className="selected-path">
            {getDisplayPath(settings.outputDirectory)}
          </span>
        </div>
      </div>
      
      <div className="setting-group">
        <label htmlFor="preserveMetadata">
          <input 
            type="checkbox" 
            id="preserveMetadata" 
            checked={settings.preserveMetadata} 
            onChange={handlePreserveMetadataChange}
          />
          Preserve Metadata
        </label>
      </div>

      <div className="setting-group">
        <button 
          type="button" 
          className="cleanup-btn"
          onClick={handleCleanupTempFiles}
          disabled={isCleaningUp}
        >
          {isCleaningUp ? 'Cleaning...' : 'Cleanup Temporary Files'}
        </button>
        <small className="setting-description">
          {cleanupMessage}
        </small>
      </div>
    </div>
  );
};

export default SettingsPanel; 