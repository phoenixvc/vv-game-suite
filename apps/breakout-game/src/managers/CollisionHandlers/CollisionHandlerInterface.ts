import * as Phaser from 'phaser';
import MatterJS from 'matter-js';

export interface CollisionHandlerInterface {
  handleCollision(
    bodyA: MatterJS.BodyType, 
    bodyB: MatterJS.BodyType, 
    stage: 'start' | 'active' | 'end'
  ): boolean; // Return true if handled, false otherwise
}