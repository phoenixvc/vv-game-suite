import React, { useState } from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import PaddleController from './components/PaddleController';
import SettingsMenu from './components/SettingsMenu';
import Score from './components/Score';

const Game: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Game dimensions
  const gameWidth = 800;
  const gameHeight = 600;
  
  // Paddle properties
  const paddleWidth = 100;
  const paddleHeight = 20;
  const paddleSpeed = 10;
  const paddleColor = '#4a90e2';
  const angleFactor = 5;
  return (
    <SettingsProvider>
      <div className="game-wrapper" style={{ position: 'relative' }}>
        <div className="game-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
          <Score score={score} highScore={highScore} />
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
        
        <PaddleController
          width={paddleWidth}
          height={paddleHeight}
          color={paddleColor}
          speed={paddleSpeed}
          gameWidth={gameWidth}
          gameHeight={gameHeight}
          angleFactor={angleFactor}
          player={1}
        />
        <SettingsMenu 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    </SettingsProvider>
  );
};

export default Game;
