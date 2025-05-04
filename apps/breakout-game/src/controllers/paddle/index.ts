import PaddleController from './PaddleController';
import BasePaddleController from './BasePaddleController';
import KeyboardPaddleController from './KeyboardPaddleController';
import MousePaddleController from './MousePaddleController';
import AIPaddleController from './AIPaddleController';

// Export the main PaddleController as default
export default PaddleController;

// Export all controllers
export {
  BasePaddleController,
  KeyboardPaddleController,
  MousePaddleController,
  AIPaddleController
};