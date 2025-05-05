/**
 * UI Manager module exports
 * Entry point for all UI-related components
 */

import UIManager from './UIManager';
import UIConstants from './UIConstants';
import UIMessageDisplay from './UIMessageDisplay';
import UIPauseMenu from './UIPauseMenu';
import UIHudContainer from './HUD';
import UISpeedMeter from './HUD';
import UISettingsPanel from './Settings';
import UIGameOverPanel from './UIGameOverPanel';
import UIPowerUpDisplay from './UIPowerUpDisplay';
import UIThemeIntegration from './UIThemeIntegration';

export {
  UIManager,
  UIConstants,
  UIMessageDisplay,
  UIPauseMenu,
  UISettingsPanel,
  UIGameOverPanel,
  UIPowerUpDisplay,
  UIHudContainer,
  UISpeedMeter,
  UIThemeIntegration
};

export default UIManager;