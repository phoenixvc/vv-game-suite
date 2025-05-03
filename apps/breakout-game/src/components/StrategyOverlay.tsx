import React from 'react';
import { useGameContext } from '../contexts/GameContext';

// Define a simple strategy interface
interface Strategy {
  id: string;
  name: string;
  description: string;
}

// Define strategies as a constant
const STRATEGIES: Strategy[] = [
  { id: 'aggressive', name: 'Aggressive', description: 'High risk, high reward strategy' },
  { id: 'balanced', name: 'Balanced', description: 'Moderate risk and reward' },
  { id: 'conservative', name: 'Conservative', description: 'Low risk, steady rewards' }
];

// Create a simple tooltip component
const StrategyTooltip: React.FC<Strategy> = ({ name, description }) => (
  <div className="strategy-tooltip">
    <h3>{name}</h3>
    <p>{description}</p>
  </div>
);

const StrategyOverlay: React.FC = () => {
  const { makeStrategyDecision } = useGameContext();

  return (
    <div className="strategy-grid">
      {STRATEGIES.map(strat => (
        <button 
          key={strat.id}
          onClick={() => makeStrategyDecision(strat.id)}
          className="bg-defi-blue hover:bg-defi-purple"
        >
          <StrategyTooltip {...strat} />
        </button>
      ))}
    </div>
  );
};

export default StrategyOverlay;
