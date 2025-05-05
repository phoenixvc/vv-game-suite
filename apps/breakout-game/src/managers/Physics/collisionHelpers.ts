import { PhysicsManager } from './index';

/**
 * Setup collision groups for the physics world
 * @param physicsManager The physics manager instance
 * @returns Configured collision groups
 */
export function setupCollisionGroups(physicsManager: PhysicsManager) {
  // Define collision categories
  const categories = {
    default: 0x0001,
    ball: 0x0002,
    paddle: 0x0004,
    brick: 0x0008,
    wall: 0x0010,
    powerUp: 0x0020,
    laser: 0x0040,
    shield: 0x0080
  };

  // Define collision groups with their categories and masks
  const collisionGroups = {
    default: {
      category: categories.default,
      mask: categories.default | categories.wall
    },
    ball: {
      category: categories.ball,
      // Make sure ball collides with paddle, brick, and wall
      mask: categories.paddle | categories.brick | categories.wall | categories.shield
    },
    paddle: {
      category: categories.paddle,
      // Make sure paddle collides with ball, powerUp, and wall
      mask: categories.ball | categories.powerUp | categories.wall
    },
    brick: {
      category: categories.brick,
      mask: categories.ball | categories.laser
    },
    wall: {
      category: categories.wall,
      mask: categories.ball | categories.paddle | categories.default | categories.powerUp
    },
    powerUp: {
      category: categories.powerUp,
      mask: categories.paddle | categories.wall
    },
    laser: {
      category: categories.laser,
      mask: categories.brick
    },
    shield: {
      category: categories.shield,
      mask: categories.ball
    }
  };

  // Log collision groups for debugging
  console.log('Collision groups set up:', collisionGroups);

  return collisionGroups;
}

/**
 * Setup collision callbacks for the physics world
 * @param physicsManager The physics manager instance
 */
export function setupCollisionCallbacks(physicsManager: PhysicsManager) {
  const scene = physicsManager.getScene();
  
  // Set up collision event handling
  scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
    // Process each collision pair
    for (const pair of event.pairs) {
      // Get the game objects involved in the collision
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;
      
      // Get the game objects from the bodies
      const gameObjectA = bodyA.gameObject;
      const gameObjectB = bodyB.gameObject;
      
      // Check if either object has debug collisions enabled
      const debugA = gameObjectA && gameObjectA.getData && gameObjectA.getData('debugCollisions');
      const debugB = gameObjectB && gameObjectB.getData && gameObjectB.getData('debugCollisions');
      
      if (debugA || debugB) {
        // Log collision for debugging
        const typeA = (bodyA as any).label || (gameObjectA && gameObjectA.getData ? gameObjectA.getData('type') : 'unknown');
        const typeB = (bodyB as any).label || (gameObjectB && gameObjectB.getData ? gameObjectB.getData('type') : 'unknown');
        console.log(`Collision detected between ${typeA} and ${typeB}`);
      }
      
      // Process the collision through all registered handlers
      physicsManager.processCollision(bodyA, bodyB, 'start');
    }
  });

  // Optional: Handle active collisions
  scene.matter.world.on('collisionactive', (event: Phaser.Physics.Matter.Events.CollisionActiveEvent) => {
    for (const pair of event.pairs) {
      physicsManager.processCollision(pair.bodyA, pair.bodyB, 'active');
    }
  });

  // Optional: Handle collision end
  scene.matter.world.on('collisionend', (event: Phaser.Physics.Matter.Events.CollisionEndEvent) => {
    for (const pair of event.pairs) {
      physicsManager.processCollision(pair.bodyA, pair.bodyB, 'end');
    }
  });
}