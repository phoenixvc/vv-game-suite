/**
 * UISettingsTheme
 * Component for theme settings like color scheme, visual effects, etc.
 */

import UIComponent from "../UIComponent";


class UISettingsTheme extends UIComponent {
  private themeSelect: HTMLSelectElement;
  private backgroundSelect: HTMLSelectElement;
  private particleEffectsToggle: HTMLInputElement;
  private colorBlindModeToggle: HTMLInputElement;

  constructor() {
    super('settings-theme');
    
    // Create theme settings controls
    this.createControls();
  }

  private createControls(): void {
    // Create theme dropdown
    this.themeSelect = document.createElement('select');
    const themes = ['Classic', 'Neon', 'Retro', 'Minimalist', 'Dark'];
    themes.forEach(theme => {
      const option = document.createElement('option');
      option.value = theme.toLowerCase();
      option.textContent = theme;
      this.themeSelect.appendChild(option);
    });
    
    // Create background dropdown
    this.backgroundSelect = document.createElement('select');
    const backgrounds = ['Default', 'Stars', 'Gradient', 'Solid Color', 'Custom'];
    backgrounds.forEach(bg => {
      const option = document.createElement('option');
      option.value = bg.toLowerCase().replace(' ', '-');
      option.textContent = bg;
      this.backgroundSelect.appendChild(option);
    });
    
    // Create particle effects toggle
    this.particleEffectsToggle = document.createElement('input');
    this.particleEffectsToggle.type = 'checkbox';
    this.particleEffectsToggle.checked = true;
    
    // Create colorblind mode toggle
    this.colorBlindModeToggle = document.createElement('input');
    this.colorBlindModeToggle.type = 'checkbox';
    
    // Add event listeners
    this.themeSelect.addEventListener('change', this.onThemeChange.bind(this));
    this.backgroundSelect.addEventListener('change', this.onBackgroundChange.bind(this));
    this.particleEffectsToggle.addEventListener('change', this.onParticleEffectsToggle.bind(this));
    this.colorBlindModeToggle.addEventListener('change', this.onColorBlindModeToggle.bind(this));
  }

  public initialize(): void {
    // Create section title
    const title = document.createElement('h3');
    title.textContent = 'Theme Settings';
    this.element.appendChild(title);
    
    // Create container for settings
    const container = document.createElement('div');
    container.className = 'theme-settings-container';
    
    // Add theme setting
    const themeContainer = document.createElement('div');
    const themeLabel = document.createElement('label');
    themeLabel.textContent = 'Color Theme:';
    themeContainer.appendChild(themeLabel);
    themeContainer.appendChild(this.themeSelect);
    container.appendChild(themeContainer);
    
    // Add background setting
    const backgroundContainer = document.createElement('div');
    const backgroundLabel = document.createElement('label');
    backgroundLabel.textContent = 'Background:';
    backgroundContainer.appendChild(backgroundLabel);
    backgroundContainer.appendChild(this.backgroundSelect);
    container.appendChild(backgroundContainer);
    
    // Add particle effects setting
    const particleContainer = document.createElement('div');
    const particleLabel = document.createElement('label');
    particleLabel.textContent = 'Particle Effects:';
    particleContainer.appendChild(particleLabel);
    particleContainer.appendChild(this.particleEffectsToggle);
    container.appendChild(particleContainer);
    
    // Add colorblind mode setting
    const colorBlindContainer = document.createElement('div');
    const colorBlindLabel = document.createElement('label');
    colorBlindLabel.textContent = 'Colorblind Mode:';
    colorBlindContainer.appendChild(colorBlindLabel);
    colorBlindContainer.appendChild(this.colorBlindModeToggle);
    container.appendChild(colorBlindContainer);
    
    // Add preview section
    const previewSection = document.createElement('div');
    previewSection.className = 'theme-preview';
    const previewTitle = document.createElement('h4');
    previewTitle.textContent = 'Preview';
    previewSection.appendChild(previewTitle);
    
    const previewCanvas = document.createElement('div');
    previewCanvas.className = 'theme-preview-canvas';
    previewSection.appendChild(previewCanvas);
    
    container.appendChild(previewSection);
    
    this.element.appendChild(container);
  }

  private onThemeChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    // Logic to update game theme
    console.log(`Theme changed to ${value}`);
    this.updatePreview();
  }

  private onBackgroundChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    // Logic to update background
    console.log(`Background changed to ${value}`);
    this.updatePreview();
  }

  private onParticleEffectsToggle(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    // Logic to toggle particle effects
    console.log(`Particle effects ${checked ? 'enabled' : 'disabled'}`);
    this.updatePreview();
  }

  private onColorBlindModeToggle(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    // Logic to toggle colorblind mode
    console.log(`Colorblind mode ${checked ? 'enabled' : 'disabled'}`);
    this.updatePreview();
  }
  
  private updatePreview(): void {
    // Logic to update the theme preview
    const previewCanvas = this.element.querySelector('.theme-preview-canvas');
    if (previewCanvas) {
      // Update the preview with current theme settings
      const theme = this.themeSelect.value;
      const background = this.backgroundSelect.value;
      
      // This would be replaced with actual preview rendering logic
      previewCanvas.setAttribute('data-theme', theme);
      previewCanvas.setAttribute('data-background', background);
    }
  }
}

export default UISettingsTheme;