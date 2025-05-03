import React from 'react';

interface ScoreProps {
  score: number;
  highScore?: number;
}

const Score: React.FC<ScoreProps> = ({ score, highScore }) => {
  return (
    <div className="score-container">
      <div className="current-score">Score: {score}</div>
      {highScore !== undefined && (
        <div className="high-score">High Score: {highScore}</div>
      )}
    </div>
  );
};

export default Score;