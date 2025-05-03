import React from 'react';
import { useSettingsContext } from '../contexts/SettingsContext';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose }) => {
  const { 
    soundOn, 
    toggleSound, 
    backgroundMusicOn, 
    toggleBackgroundMusic,
    controls,
    setControls
  } = useSettingsContext();
  
  if (!isOpen) return null;
  
  return (
    <div className="settings-overlay" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div className="settings-panel"
        style={{
          backgroundColor: '#221e30',
          borderRadius: '8px',
          padding: '20px',
          width: '300px',
          color: 'white'
        }}
      >
        <h2 style={{ marginTop: 0 }}>Game Settings</h2>
        
        <div className="setting-item" style={{ margin: '15px 0' }}>
          <label>
            <input 
              type="checkbox" 
              checked={soundOn} 
              onChange={toggleSound} 
            />
            {' '}Sound Effects
          </label>
        </div>
        
        <div className="setting-item" style={{ margin: '15px 0' }}>
          <label>
            <input 
              type="checkbox" 
              checked={backgroundMusicOn} 
              onChange={toggleBackgroundMusic} 
            />
            {' '}Background Music
          </label>
        </div>
        
        <div className="setting-item" style={{ margin: '15px 0' }}>
          <p>Control Mode:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <label>
              <input 
                type="radio" 
                name="controlMode" 
                value="keyboard" 
                checked={controls === 'keyboard'} 
                onChange={() => setControls('keyboard')} 
              />
              {' '}Keyboard
            </label>
            <label>
              <input 
                type="radio" 
                name="controlMode" 
                value="mouse" 
                checked={controls === 'mouse'} 
                onChange={() => setControls('mouse')} 
              />
              {' '}Mouse
            </label>
          </div>
          <small style={{ display: 'block', marginTop: '5px', opacity: 0.7 }}>
            You can also press 'M' during gameplay to toggle control modes
          </small>
        </div>
        
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsMenu;