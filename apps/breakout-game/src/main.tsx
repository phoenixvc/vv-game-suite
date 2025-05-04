import './phaser-init'; // Import this first to ensure Phaser is initialized
import ReactDOM from 'react-dom/client'
import Game from './Game'
import './index.css'
import { GameProvider } from './contexts/GameContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <GameProvider>
    <Game/>
  </GameProvider>
);
