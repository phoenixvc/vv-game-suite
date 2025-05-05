/**
 * UISettingsGameplay
 * Component for gameplay settings like difficulty level, ball speed, etc.
 */

import UIComponent from "../UIComponent";


class UISettingsGameplay extends UIComponent {
  private difficultySelect: HTMLSelectElement;
  private ballSpeedSlider: HTMLInputElement;
  private paddleSizeSelect: HTMLSelectElement;
  private powerupsToggle: HTMLInputElement;

  constructor() {
    super('settings-gameplay');
    
    // Create gameplay settings controls
    this.createControls();
  }

  private createControls(): void {
    // Create difficulty dropdown
    this.difficultySelect = document.createElement('select');
    const difficulties = ['Easy', 'Normal', 'Hard', 'Expert'];
    difficulties.forEach(difficulty => {
      const option = document.createElement('option');
      option.value = difficulty.toLowerCase();
      option.textContent = difficulty;
      this.difficultySelect.appendChild(option);
    });
    
    // Create ball speed slider
    this.ballSpeedSlider = document.createElement('input');
    this.ballSpeedSlider.type = 'range';
    this.ballSpeedSlider.min = '1';
    this.ballSpeedSlider.max = '10';
    this.ballSpeedSlider.value = '5';
    
    // Create paddle size dropdown
    this.paddleSizeSelect = document.createElement('select');
    const paddleSizes = ['Small', 'Medium', 'Large'];
    paddleSizes.forEach(size => {
      const option = document.createElement('option');
      option.value = size.toLowerCase();
      option.textContent = size;
      this.paddleSizeSelect.appendChild(option);
    });
    
    // Create powerups toggle
    this.powerupsToggle = document.createElement('input');
    this.powerupsToggle.type = 'checkbox';
    this.powerupsToggle.checked = true;
    
    // Add event listeners
    this.difficultySelect.addEventListener('change', this.onDifficultyChange.bind(this));
    this.ballSpeedSlider.addEventListener('input', this.onBallSpeedChange.bind(this));
    this.paddleSizeSelect.addEventListener('change', this.onPaddleSizeChange.bind(this));
    this.powerupsToggle.addEventListener('change', this.onPowerupsToggle.bind(this));
  }

  public initialize(): void {
    // Create section title
    const title = document.createElement('h3');
    title.textContent = 'Gameplay Settings';
    this.element.appendChild(title);
    
    // Create container for settings
    const container = document.createElement('div');
    container.className = 'gameplay-settings-container';
    
    // Add difficulty setting
    const difficultyContainer = document.createElement('div');
    const difficultyLabel = document.createElement('label');
    difficultyLabel.textContent = 'Difficulty:';
    difficultyContainer.appendChild(difficultyLabel);
    difficultyContainer.appendChild(this.difficultySelect);
    container.appendChild(difficultyContainer);
    
    // Add ball speed setting
    const ballSpeedContainer = document.createElement('div');
    const ballSpeedLabel = document.createElement('label');
    ballSpeedLabel.textContent = 'Ball Speed:';
    ballSpeedContainer.appendChild(ballSpeedLabel);
    ballSpeedContainer.appendChild(this.ballSpeedSlider);
    container.appendChild(ballSpeedContainer);
    
    // Add paddle size setting
    const paddleSizeContainer = document.createElement('div');
    const paddleSizeLabel = document.createElement('label');
    paddleSizeLabel.textContent = 'Paddle Size:';
    paddleSizeContainer.appendChild(paddleSizeLabel);
    paddleSizeContainer.appendChild(this.paddleSizeSelect);
    container.appendChild(paddleSizeContainer);
    
    // Add powerups toggle setting
    const powerupsContainer = document.createElement('div');
    const powerupsLabel = document.createElement('label');
    powerupsLabel.textContent = 'Enable Powerups:';
    powerupsContainer.appendChild(powerupsLabel);
    powerupsContainer.appendChild(this.powerupsToggle);
    container.appendChild(powerupsContainer);
    
    this.element.appendChild(container);
  }

  private onDifficultyChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    // Logic to update game difficulty
    console.log(`Difficulty changed to ${value}`);
  }

  private onBallSpeedChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    // Logic to update ball speed
    console.log(`Ball speed changed to ${value}`);
  }

  private onPaddleSizeChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    // Logic to update paddle size
    console.log(`Paddle size changed to ${value}`);
  }

  private onPowerupsToggle(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    // Logic to toggle powerups
    console.log(`Powerups ${checked ? 'enabled' : 'disabled'}`);
  }
}

export default UISettingsGameplay;