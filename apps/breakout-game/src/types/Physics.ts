/**
 * Defines collision category and mask for a specific game object type
 */
export interface CollisionGroup {
  /**
   * The collision category bitmask for this group
   */
  category: number;
  
  /**
   * The collision mask bitmask defining what this group can collide with
   */
  mask: number;
}

/**
 * Defines all collision groups used in the game
 */
export interface CollisionGroups {
  /**
   * Ball collision group
   */
  ball?: CollisionGroup;
  
  /**
   * Paddle collision group
   */
  paddle?: CollisionGroup;
  
  /**
   * Brick collision group
   */
  brick?: CollisionGroup;
  
  /**
   * Wall collision group
   */
  wall?: CollisionGroup;
  
  /**
   * Power-up collision group
   */
  powerUp?: CollisionGroup;
  
  /**
   * Laser collision group
   */
  laser?: CollisionGroup;
  
  /**
   * Shield collision group
   */
  shield?: CollisionGroup;
  
  /**
   * Additional collision groups can be added with string indexing
   */
  [key: string]: CollisionGroup | undefined;
}

/**
 * Valid collision object types in the game
 */
export type CollisionObjectType = 'ball' | 'paddle' | 'brick' | 'wall' | 'powerUp' | 'laser' | 'shield';