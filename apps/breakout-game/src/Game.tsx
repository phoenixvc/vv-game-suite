import 'phaser'
import { useState, useEffect } from 'react'
import config from './config/Config'
import './Assets/styles/style.css'
import { MarketDataProvider } from './context/MarketDataContext';
import { GameProvider, useGameContext } from './contexts/GameContext';
import { HighScoreProvider } from './contexts/HighScoreContext';
import { SettingsProvider } from './contexts/SettingsContext';

export default function Game() {
  const { getAngleFactor } = useGameContext();
  const angleFactor = getAngleFactor();

  const [game, setGame] = useState<Phaser.Game>({} as Phaser.Game)

  useEffect(() => {
    const game: Phaser.Game = new Phaser.Game({
      ...config,
      scene: {
        ...config.scene,
        create: function () {
          this.registry.set('angleFactor', angleFactor);
          const marketData = this.registry.get('marketData');
          this.registry.set('marketData', marketData);
          const levelTheme = this.registry.get('levelTheme');
          this.registry.set('levelTheme', levelTheme);
        }
      }
    });
    setGame(game)
  }, [angleFactor])
  return (
    <MarketDataProvider>
      <GameProvider>
        <HighScoreProvider>
          <SettingsProvider>
            <main>
              <div id="game" />
            </main>
          </SettingsProvider>
        </HighScoreProvider>
      </GameProvider>
    </MarketDataProvider>
  )
}
