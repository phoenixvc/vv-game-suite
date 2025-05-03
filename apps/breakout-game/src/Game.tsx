import 'phaser'
import { useState, useEffect } from 'react'
import config from './config/Config'
import './Assets/styles/style.css'
import { GameProvider, useGameContext } from './contexts/GameContext';

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
        }
      }
    });
    setGame(game)
  }, [angleFactor])
  return (
    <GameProvider>
      <main>
        <div id="game" />
      </main>
    </GameProvider>
  )
}
