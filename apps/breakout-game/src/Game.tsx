import React, { useEffect, useRef, useState } from 'react';
import { SettingsProvider, useSettingsContext } from './contexts/SettingsContext';
import PaddleController from './components/PaddleController';
import SettingsMenu from './components/SettingsMenu';
import Score from './components/Score';
import config from './config/Config';
import * as Phaser from 'phaser';

// Create a component that initializes the game with settings
const GameInitializer: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { getActivePaddles, controls } = useSettingsContext();
  
  useEffect(() => {
    // Only create the game once
    if (!gameRef.current) {
      // Create a new game instance
      gameRef.current = new Phaser.Game({
        ...config,
        callbacks: {
          preBoot: (game) => {
            // Store settings in a global game registry that scenes can access
            game.registry.set('activePaddles', getActivePaddles());
            game.registry.set('controlType', controls);
          }
        }
      });
    }
    
    // Update game settings when they change
    if (gameRef.current) {
      gameRef.current.registry.set('activePaddles', getActivePaddles());
      gameRef.current.registry.set('controlType', controls);
    }
    
    // Clean up on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [getActivePaddles, controls]);

  return <div id="game" />;
};

const Game: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <SettingsProvider>
      <div className="game-wrapper" style={{ position: 'relative' }}>
        <div className="game-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Settings
          </button>
        </div>
        
        <GameInitializer />
        
        <SettingsMenu 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    </SettingsProvider>
  );
};
export default Game;
