/**
 * UISettingsControls
 * Component for game control settings like keyboard mappings, mouse sensitivity, etc.
 */

import UIComponent from "../UIComponent";


class UISettingsControls extends UIComponent {
  private controlMappings: Map<string, string>;
  private controlElements: Map<string, HTMLElement>;

  constructor() {
    super('settings-controls');
    
    this.controlMappings = new Map([
      ['moveLeft', 'ArrowLeft'],
      ['moveRight', 'ArrowRight'],
      ['launchBall', 'Space'],
      ['pause', 'Escape']
    ]);
    
    this.controlElements = new Map();
  }

  public initialize(): void {
    // Create section title
    const title = document.createElement('h3');
    title.textContent = 'Control Settings';
    this.element.appendChild(title);
    
    // Create control mapping interface
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';
    
    this.controlMappings.forEach((key, action) => {
      const row = document.createElement('div');
      row.className = 'control-row';
      
      const actionLabel = document.createElement('span');
      actionLabel.textContent = this.formatActionName(action);
      
      const keyButton = document.createElement('button');
      keyButton.textContent = key;
      keyButton.addEventListener('click', () => this.startRebinding(action, keyButton));
      
      this.controlElements.set(action, keyButton);
      
      row.appendChild(actionLabel);
      row.appendChild(keyButton);
      controlsContainer.appendChild(row);
    });
    
    // Reset to defaults button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset to Defaults';
    resetButton.className = 'reset-controls-btn';
    resetButton.addEventListener('click', this.resetToDefaults.bind(this));
    
    this.element.appendChild(controlsContainer);
    this.element.appendChild(resetButton);
  }

  private formatActionName(action: string): string {
    // Convert camelCase to Title Case with spaces
    return action
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  private startRebinding(action: string, button: HTMLButtonElement): void {
    button.textContent = 'Press any key...';
    
    const keyHandler = (e: KeyboardEvent) => {
      e.preventDefault();
      
      // Update the control mapping
      this.controlMappings.set(action, e.key);
      button.textContent = e.key;
      
      // Remove the temporary event listener
      document.removeEventListener('keydown', keyHandler);
      
      // Save the updated control mappings
      this.saveControlMappings();
    };
    
    document.addEventListener('keydown', keyHandler);
  }

  private resetToDefaults(): void {
    // Reset to default controls
    this.controlMappings.set('moveLeft', 'ArrowLeft');
    this.controlMappings.set('moveRight', 'ArrowRight');
    this.controlMappings.set('launchBall', 'Space');
    this.controlMappings.set('pause', 'Escape');
    
    // Update UI
    this.controlMappings.forEach((key, action) => {
      const element = this.controlElements.get(action);
      if (element) {
        element.textContent = key;
      }
    });
    
    // Save the updated mappings
    this.saveControlMappings();
  }

  private saveControlMappings(): void {
    // Logic to save control mappings to game settings
    console.log('Saving control mappings:', Object.fromEntries(this.controlMappings));
  }
}

export default UISettingsControls;