// collisionUtils.ts
import * as Phaser from 'phaser';

export function applyCollisionCategory(
  gameObject: Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image,
  category: number,
  mask: number
): void {
  if (!gameObject.body) return;

  const matterBody = gameObject.body as any;

  if (matterBody.collisionFilter) {
    matterBody.collisionFilter.category = category;
    matterBody.collisionFilter.mask = mask;
  } else if (Array.isArray(matterBody.parts)) {
    matterBody.parts.forEach(part => {
      if (part.collisionFilter) {
        part.collisionFilter.category = category;
        part.collisionFilter.mask = mask;
      }
    });
  }
}

export function setCombinedCollisionMask(
  types: string[],
  collisionGroups: Record<string, { category: number }>
): number {
  return types.reduce((mask, type) => {
    const group = collisionGroups[type];
    return group ? mask | group.category : mask;
  }, 0);
}
