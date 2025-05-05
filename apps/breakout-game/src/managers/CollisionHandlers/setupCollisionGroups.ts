// setupCollisionGroups.ts

import { PHYSICS } from "@/constants/GameConstants";

export function setupCollisionGroups() {
  return {
    ball: {
      category: PHYSICS.COLLISION.BALL,
      mask: PHYSICS.COLLISION.PADDLE | PHYSICS.COLLISION.BRICK | PHYSICS.COLLISION.WALL
    },
    paddle: {
      category: PHYSICS.COLLISION.PADDLE,
      mask: PHYSICS.COLLISION.BALL | PHYSICS.COLLISION.POWERUP
    },
    brick: {
      category: PHYSICS.COLLISION.BRICK,
      mask: PHYSICS.COLLISION.BALL | PHYSICS.COLLISION.LASER
    },
    wall: {
      category: PHYSICS.COLLISION.WALL,
      mask: PHYSICS.COLLISION.BALL
    },
    powerUp: {
      category: PHYSICS.COLLISION.POWERUP,
      mask: PHYSICS.COLLISION.PADDLE
    },
    laser: {
      category: PHYSICS.COLLISION.LASER,
      mask: PHYSICS.COLLISION.BRICK
    },
    shield: {
      category: PHYSICS.COLLISION.SHIELD,
      mask: PHYSICS.COLLISION.BALL
    }
  };
}
