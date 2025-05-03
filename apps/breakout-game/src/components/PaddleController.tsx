import React, { useEffect, useState } from 'react';
import { useSettingsContext } from '../contexts/SettingsContext';
import { KeyboardPaddle, MousePaddle } from './Paddle';

interface PaddleControllerProps {
  width: number;
  height: number;
  color: string;
  speed: number;
  gameWidth: number;
  gameHeight: number;
  angleFactor: number;
  player?: number;
}

const PaddleController: React.FC<PaddleControllerProps> = (props) => {
  // Get control preference from settings context
  const { controls } = useSettingsContext();
  
  // Local state for control mode that defaults to the context value
  const [controlMode, setControlMode] = useState<'keyboard' | 'mouse'>(
    controls === 'mouse' ? 'mouse' : 'keyboard'
  );
  
  // Update local state when context changes
  useEffect(() => {
    setControlMode(controls === 'mouse' ? 'mouse' : 'keyboard');
  }, [controls]);
  
  // Allow toggling with 'M' key for quick switching during gameplay
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm') {
        setControlMode((prev: 'keyboard' | 'mouse') => prev === 'keyboard' ? 'mouse' : 'keyboard');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Render the appropriate paddle component based on control mode
  return (
    <>
      {controlMode === 'keyboard' ? (
        <KeyboardPaddle {...props} />
      ) : (
        <MousePaddle {...props} />
      )}
      <div 
        className="control-mode-toggle"
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 100
        }}
      >
        Press 'M' to toggle control mode: {controlMode}
      </div>
    </>
  );
};

export default PaddleController;