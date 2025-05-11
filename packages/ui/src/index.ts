// UI Package Entry Point

/**
 * Placeholder export for the UI package
 * This file serves as the entry point for the UI package
 */
export const version = '0.1.0';

/**
 * Basic Button component interface
 */
export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

/**
 * Example function to demonstrate package functionality
 */
export function isValidButtonProps(props: ButtonProps): boolean {
  return !!props.label && typeof props.onClick === 'function';
}