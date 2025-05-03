import 'phaser'
import { useState, useEffect } from 'react'
import config from './config/Config'
import './Assets/styles/style.css'
import { GameProvider } from './contexts/GameContext';
import { MarketDataProvider } from './context/MarketDataContext';

export default function Game() {

  const [game, setGame] = useState<Phaser.Game>({} as Phaser.Game)

  useEffect(() => {
    const game: Phaser.Game = new Phaser.Game(config)
    setGame(game)
  }, [])
  return (
    <MarketDataProvider>
      <GameProvider>
        <main>
          <div id="game" />
        </main>
      </GameProvider>
    </MarketDataProvider>
  )
}
