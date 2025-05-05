/**
 * NeuralIquidThemeIntegration
 * 
 * This module integrates the NeuralIquid theme with the ThemeManager
 * and provides helper functions for applying the theme to game elements.
 */

import * as Phaser from 'phaser';

/**
 * Create a NeuralIquid theme configuration for the ThemeManager
 * @returns {Object} Theme configuration object
 */
export function createNeuralIquidTheme() {
  return {
    name: 'NeuralIquid',
    backgroundColor: 0x0a0e1a, // --dark-bg from CSS
    textColor: '#e0e6ff', // --text-light from CSS
    accentColor: '#4682ff', // --primary-blue from CSS
    particleColor: 0x00e2ff, // --accent-cyan from CSS
    ballColor: 0x4682ff, // --primary-blue from CSS
    paddleColor: 0x9370ff, // --primary-purple from CSS
    uiColor: '#00e2ff', // --accent-cyan from CSS
    wallColor: 0x1e2642, // --border-color from CSS
    brickColors: {
      standard: 0x4682ff, // --primary-blue
      explosive: 0xff6600, // Orange (kept from other themes)
      reinforced: 0x1e2642, // --border-color
      powerup: 0x00e2ff, // --accent-cyan
      indestructible: 0x070b14 // --darker-bg
    }
  };
}

/**
 * Apply NeuralIquid theme styles to a text object
 * @param {Phaser.GameObjects.Text} textObject - The text object to style
 * @param {string} style - Style variant ('title', 'subtitle', 'body', etc.)
 */
export function styleText(textObject, style = 'body') {
  if (!textObject) return;
  
  const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  
  switch (style) {
    case 'title':
      textObject.setStyle({
        fontFamily,
        fontSize: '28px',
        color: '#ffffff',
        fontWeight: 'bold'
      });
      break;
    case 'subtitle':
      textObject.setStyle({
        fontFamily,
        fontSize: '20px',
        color: '#4682ff',
        fontWeight: 'bold'
      });
      break;
    case 'body':
      textObject.setStyle({
        fontFamily,
        fontSize: '16px',
        color: '#e0e6ff'
      });
      break;
    case 'accent':
      textObject.setStyle({
        fontFamily,
        fontSize: '16px',
        color: '#00e2ff'
      });
      break;
    case 'button':
      textObject.setStyle({
        fontFamily,
        fontSize: '16px',
        color: '#ffffff',
        fontWeight: 'bold'
      });
      break;
  }
}

/**
 * Create a styled button using NeuralIquid theme
 * @param {Phaser.Scene} scene - The scene to add the button to
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} text - Button text
 * @param {Function} callback - Click callback function
 * @param {string} style - Button style ('primary', 'secondary')
 * @returns {Phaser.GameObjects.Container} Button container
 */
export function createButton(scene, x, y, text, callback, style = 'primary') {
  const container = scene.add.container(x, y);
  
  // Create background with appropriate style
  let bg;
  if (style === 'primary') {
    // Create gradient texture for primary button
    const gradientTexture = createGradientTexture(scene, 0x4682ff, 0x9370ff);
    bg = scene.add.image(0, 0, gradientTexture);
  } else {
    // Secondary button with border
    bg = scene.add.rectangle(0, 0, 120, 40, 0x111527);
    bg.setStrokeStyle(1, 0x4682ff);
  }
  
  // Set size
  bg.setDisplaySize(120, 40);
  
  // Create text
  const textObj = scene.add.text(0, 0, text, {
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    color: style === 'primary' ? '#ffffff' : '#4682ff'
  }).setOrigin(0.5);
  
  // Add to container
  container.add([bg, textObj]);
  
  // Make interactive
  bg.setInteractive({ useHandCursor: true })
    .on('pointerdown', callback)
    .on('pointerover', () => {
      if (style === 'primary') {
        bg.setTint(0xaabbff);
      } else {
        bg.setFillStyle(0x1a2642);
      }
    })
    .on('pointerout', () => {
      if (style === 'primary') {
        bg.clearTint();
      } else {
        bg.setFillStyle(0x111527);
      }
    });
  
  return container;
}

/**
 * Create a gradient texture for use in UI elements
 * @param {Phaser.Scene} scene - The scene to add the texture to
 * @param {number} color1 - Start color (hex)
 * @param {number} color2 - End color (hex)
 * @returns {string} Texture key
 */
export function createGradientTexture(scene, color1, color2) {
  const textureKey = `gradient-${color1.toString(16)}-${color2.toString(16)}`;
  
  // Check if texture already exists
  if (scene.textures.exists(textureKey)) {
    return textureKey;
  }
  
  // Create the gradient texture
  const width = 256;
  const height = 64;
  
  const rt = scene.add.renderTexture(0, 0, width, height);
  
  // Create a canvas to draw the gradient
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, `#${color1.toString(16)}`);
  gradient.addColorStop(1, `#${color2.toString(16)}`);
  
  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Create texture from canvas
  rt.draw(canvas);
  rt.saveTexture(textureKey);
  rt.destroy();
  
  return textureKey;
}

/**
 * Apply NeuralIquid theme to a panel
 * @param {Phaser.GameObjects.Container} panel - The panel container
 * @param {Object} options - Panel options
 */
export function stylePanel(panel, options = {}) {
  const bg = panel.getByName('background');
  if (bg) {
    bg.setFillStyle(0x111527, options.alpha || 0.9);
    bg.setStrokeStyle(1, 0x1e2642);
  }
  
  // Style title if it exists
  const title = panel.getByName('title');
  if (title) {
    styleText(title, 'title');
  }
}

/**
 * Apply NeuralIquid theme to game HUD
 * @param {Object} hud - The HUD object with various elements
 */
export function styleHUD(hud) {
  if (!hud) return;
  
  // Style background
  if (hud.background) {
    hud.background.setFillStyle(0x111527, 0.8);
    hud.background.setStrokeStyle(1, 0x1e2642);
  }
  
  // Style score text
  if (hud.scoreText) {
    styleText(hud.scoreText, 'accent');
  }
  
  // Style lives text
  if (hud.livesText) {
    styleText(hud.livesText, 'body');
  }
  
  // Style level text
  if (hud.levelText) {
    styleText(hud.levelText, 'subtitle');
  }
}