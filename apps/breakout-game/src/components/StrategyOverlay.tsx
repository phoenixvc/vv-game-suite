import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import { STRATEGIES } from '../utils/constants';
import StrategyTooltip from './StrategyTooltip';

const StrategyOverlay = () => {
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
