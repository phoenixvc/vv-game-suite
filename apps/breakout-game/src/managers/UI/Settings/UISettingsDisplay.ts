/**
 * UISettingsDisplay
 * Component for display settings like resolution, fullscreen mode, etc.
 */

import UIComponent from "../UIComponent";


class UISettingsDisplay extends UIComponent {
  private resolutionSelect: HTMLSelectElement;
  private fullscreenToggle: HTMLInputElement;
  private fpsCounterToggle: HTMLInputElement;

  constructor() {
    super('settings-display');
    
    // Create display settings controls
    this.createControls();
  }

  private createControls(): void {
    // Create resolution dropdown
    const resolutionLabel = document.createElement('label');
    resolutionLabel.textContent = 'Resolution:';
    this.resolutionSelect = document.createElement('select');
    
    // Add resolution options
    const resolutions = ['800x600', '1024x768', '1280x720', '1920x1080'];
    resolutions.forEach(resolution => {
      const option = document.createElement('option');
      option.value = resolution;
      option.textContent = resolution;
      this.resolutionSelect.appendChild(option);
    });
    
    // Create fullscreen toggle
    const fullscreenLabel = document.createElement('label');
    fullscreenLabel.textContent = 'Fullscreen:';
    this.fullscreenToggle = document.createElement('input');
    this.fullscreenToggle.type = 'checkbox';
    
    // Create FPS counter toggle
    const fpsCounterLabel = document.createElement('label');
    fpsCounterLabel.textContent = 'Show FPS Counter:';
    this.fpsCounterToggle = document.createElement('input');
    this.fpsCounterToggle.type = 'checkbox';
    
    // Add event listeners
    this.resolutionSelect.addEventListener('change', this.onResolutionChange.bind(this));
    this.fullscreenToggle.addEventListener('change', this.onFullscreenToggle.bind(this));
    this.fpsCounterToggle.addEventListener('change', this.onFpsCounterToggle.bind(this));
  }

  public initialize(): void {
    // Create section title
    const title = document.createElement('h3');
    title.textContent = 'Display Settings';
    this.element.appendChild(title);
    
    // Create container for settings
    const container = document.createElement('div');
    container.className = 'display-settings-container';
    
    // Add resolution setting
    const resolutionContainer = document.createElement('div');
    const resolutionLabel = document.createElement('label');
    resolutionLabel.textContent = 'Resolution:';
    resolutionContainer.appendChild(resolutionLabel);
    resolutionContainer.appendChild(this.resolutionSelect);
    container.appendChild(resolutionContainer);
    
    // Add fullscreen setting
    const fullscreenContainer = document.createElement('div');
    const fullscreenLabel = document.createElement('label');
    fullscreenLabel.textContent = 'Fullscreen:';
    fullscreenContainer.appendChild(fullscreenLabel);
    fullscreenContainer.appendChild(this.fullscreenToggle);
    container.appendChild(fullscreenContainer);
    
    // Add FPS counter setting
    const fpsContainer = document.createElement('div');
    const fpsLabel = document.createElement('label');
    fpsLabel.textContent = 'Show FPS Counter:';
    fpsContainer.appendChild(fpsLabel);
    fpsContainer.appendChild(this.fpsCounterToggle);
    container.appendChild(fpsContainer);
    
    this.element.appendChild(container);
  }

  private onResolutionChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    // Logic to update game resolution
    console.log(`Resolution changed to ${value}`);
  }

  private onFullscreenToggle(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    // Logic to toggle fullscreen mode
    console.log(`Fullscreen mode ${checked ? 'enabled' : 'disabled'}`);
  }

  private onFpsCounterToggle(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    // Logic to toggle FPS counter
    console.log(`FPS counter ${checked ? 'shown' : 'hidden'}`);
  }
}

export default UISettingsDisplay;