/**
 * UIComponent
 * Base class for all UI components in the game
 */

class UIComponent {
  protected element: HTMLElement;
  protected id: string;
  protected visible: boolean = false;

  /**
   * Create a new UI component
   * @param id Unique identifier for the component
   */
  constructor(id: string) {
    this.id = id;
    this.element = document.createElement('div');
    this.element.id = `ui-${id}`;
    this.element.className = `ui-component ui-${id}`;
  }

  /**
   * Initialize the component
   * This method should be overridden by subclasses
   */
  public initialize(): void {
    // Base initialization - override in subclasses
  }

  /**
   * Get the DOM element for this component
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Show the component
   */
  public show(): void {
    this.element.style.display = 'block';
    this.visible = true;
  }

  /**
   * Hide the component
   */
  public hide(): void {
    this.element.style.display = 'none';
    this.visible = false;
  }

  /**
   * Toggle the visibility of the component
   */
  public toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Check if the component is currently visible
   */
  public isVisible(): boolean {
    return this.visible;
  }

  /**
   * Set the position of the component
   * @param x X position
   * @param y Y position
   */
  public setPosition(x: number, y: number): void {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  /**
   * Set the size of the component
   * @param width Width in pixels
   * @param height Height in pixels
   */
  public setSize(width: number, height: number): void {
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
  }

  /**
   * Add a CSS class to the component
   * @param className CSS class name to add
   */
  public addClass(className: string): void {
    this.element.classList.add(className);
  }

  /**
   * Remove a CSS class from the component
   * @param className CSS class name to remove
   */
  public removeClass(className: string): void {
    this.element.classList.remove(className);
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

export default UIComponent;