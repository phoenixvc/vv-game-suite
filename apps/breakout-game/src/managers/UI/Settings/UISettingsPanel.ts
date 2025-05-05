/**
 * UISettingsPanel
 * Main settings panel component that contains all settings sections
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import UIComponent from '../UIComponent';
import UISettingsAudio from './UISettingsAudio';
import UISettingsControls from './UISettingsControls';
import UISettingsDisplay from './UISettingsDisplay';
import UISettingsGameplay from './UISettingsGameplay';
import UISettingsTheme from './UISettingsTheme';


class UISettingsPanel extends UIComponent {
  private scene: BreakoutScene;
  private audioSettings: UISettingsAudio;
  private controlsSettings: UISettingsControls;
  private displaySettings: UISettingsDisplay;
  private gameplaySettings: UISettingsGameplay;
  private themeSettings: UISettingsTheme;

  constructor(scene: BreakoutScene) {
    super('settings-panel');
    this.scene = scene;
    
    this.audioSettings = new UISettingsAudio();
    this.controlsSettings = new UISettingsControls();
    this.displaySettings = new UISettingsDisplay();
    this.gameplaySettings = new UISettingsGameplay();
    this.themeSettings = new UISettingsTheme();
  }

  public initialize(): void {
    // Initialize all settings components
    this.audioSettings.initialize();
    this.controlsSettings.initialize();
    this.displaySettings.initialize();
    this.gameplaySettings.initialize();
    this.themeSettings.initialize();
    
    // Add settings components to the panel
    this.element.appendChild(this.audioSettings.getElement());
    this.element.appendChild(this.controlsSettings.getElement());
    this.element.appendChild(this.displaySettings.getElement());
    this.element.appendChild(this.gameplaySettings.getElement());
    this.element.appendChild(this.themeSettings.getElement());
  }

  public show(): void {
    this.element.classList.add('visible');
  }

  public hide(): void {
    this.element.classList.remove('visible');
  }

  public toggle(): void {
    this.element.classList.toggle('visible');
  }
}

export default UISettingsPanel;