import * as Phaser from 'phaser';

// Make Phaser available globally
(window as any).Phaser = Phaser;

// Create placeholder assets for missing files
const createPlaceholderAssets = () => {
  // Create SVG placeholders for common game elements
  const createSVG = (name: string, color: string = '#FFFFFF') => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '32');
    svg.setAttribute('height', '32');
    svg.setAttribute('viewBox', '0 0 32 32');
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '32');
    rect.setAttribute('height', '32');
    rect.setAttribute('fill', color);
    
    svg.appendChild(rect);
    
    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    
    // Store the URL in a global cache to be used by Phaser
    if (!(window as any).placeholderAssets) {
      (window as any).placeholderAssets = {};
    }
    (window as any).placeholderAssets[name] = url;
    
    return url;
  };
  
  // Create placeholders for all required assets
  createSVG('ball', '#FFFFFF');
  createSVG('paddle', '#0088FF');
  createSVG('paddle-vertical', '#0088FF');
  createSVG('brick', '#FF8800');
  createSVG('star', '#FFFF00');
  createSVG('powerup_multiball', '#FF5500');
  createSVG('powerup_expand', '#00FF00');
  createSVG('powerup_shrink', '#FF0000');
  createSVG('powerup_slow', '#0000FF');
  createSVG('powerup_fast', '#FFFF00');
  createSVG('powerup_extraLife', '#FF00FF');
  createSVG('powerup_laser', '#00FFFF');
  createSVG('powerup_sticky', '#8800FF');
  createSVG('powerup_shield', '#FFFFFF');
  createSVG('powerup_fireball', '#FF8800');
  createSVG('powerup_scoreMultiplier', '#8B5CF6');
  
  // Create empty audio elements for sound effects
  const createEmptyAudio = (name: string) => {
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    
    if (!(window as any).placeholderAssets) {
      (window as any).placeholderAssets = {};
    }
    (window as any).placeholderAssets[name] = audio.src;
    
    return audio.src;
  };
  
  createEmptyAudio('bounce');
  createEmptyAudio('break');
  createEmptyAudio('powerup');
};

// Override Phaser's loader to use our placeholder assets
const originalLoadImage = Phaser.Loader.FileTypes.ImageFile.prototype.load;
Phaser.Loader.FileTypes.ImageFile.prototype.load = function() {
  if (this.url.startsWith('/') && (window as any).placeholderAssets) {
    const assetName = this.url.split('/').pop()?.split('.')[0];
    if (assetName && (window as any).placeholderAssets[assetName]) {
      this.src = (window as any).placeholderAssets[assetName];
      this.xhrLoader = null;
      this.state = Phaser.Loader.FILE_POPULATED;
      this.loader.nextFile(this, true);
      return;
    }
  }
  originalLoadImage.call(this);
};

// Create placeholder assets
createPlaceholderAssets();

export default Phaser;