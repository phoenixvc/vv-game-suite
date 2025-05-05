/**
 * UISettingsAudio
 * Component for audio settings like volume controls, sound effects, music, etc.
 */

import UIComponent from "../UIComponent";


class UISettingsAudio extends UIComponent {
  private musicVolumeSlider: HTMLInputElement;
  private sfxVolumeSlider: HTMLInputElement;
  private muteToggle: HTMLInputElement;

  constructor() {
    super('settings-audio');
    
    // Create audio settings controls
    this.createControls();
  }

  private createControls(): void {
    // Create music volume slider
    const musicLabel = document.createElement('label');
    musicLabel.textContent = 'Music Volume:';
    this.musicVolumeSlider = document.createElement('input');
    this.musicVolumeSlider.type = 'range';
    this.musicVolumeSlider.min = '0';
    this.musicVolumeSlider.max = '100';
    this.musicVolumeSlider.value = '80';
    
    // Create SFX volume slider
    const sfxLabel = document.createElement('label');
    sfxLabel.textContent = 'Sound Effects:';
    this.sfxVolumeSlider = document.createElement('input');
    this.sfxVolumeSlider.type = 'range';
    this.sfxVolumeSlider.min = '0';
    this.sfxVolumeSlider.max = '100';
    this.sfxVolumeSlider.value = '100';
    
    // Create mute toggle
    const muteLabel = document.createElement('label');
    muteLabel.textContent = 'Mute All:';
    this.muteToggle = document.createElement('input');
    this.muteToggle.type = 'checkbox';
    
    // Add event listeners
    this.musicVolumeSlider.addEventListener('input', this.onMusicVolumeChange.bind(this));
    this.sfxVolumeSlider.addEventListener('input', this.onSfxVolumeChange.bind(this));
    this.muteToggle.addEventListener('change', this.onMuteToggle.bind(this));
  }

  public initialize(): void {
    // Create section title
    const title = document.createElement('h3');
    title.textContent = 'Audio Settings';
    this.element.appendChild(title);
    
    // Add controls to the component
    this.element.appendChild(document.createElement('div')).appendChild(this.musicVolumeSlider);
    this.element.appendChild(document.createElement('div')).appendChild(this.sfxVolumeSlider);
    this.element.appendChild(document.createElement('div')).appendChild(this.muteToggle);
  }

  private onMusicVolumeChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    // Logic to update music volume
    console.log(`Music volume changed to ${value}`);
  }

  private onSfxVolumeChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    // Logic to update SFX volume
    console.log(`SFX volume changed to ${value}`);
  }

  private onMuteToggle(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    // Logic to mute/unmute all audio
    console.log(`Audio ${checked ? 'muted' : 'unmuted'}`);
  }
}

export default UISettingsAudio;