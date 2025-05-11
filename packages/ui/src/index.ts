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
 * Checks whether the provided ButtonProps object has a non-empty label and a valid onClick function.
 *
 * @param props - The ButtonProps object to validate.
 * @returns True if {@link props.label} is truthy and {@link props.onClick} is a function; otherwise, false.
 */
export function isValidButtonProps(props: ButtonProps): boolean {
  return !!props.label && typeof props.onClick === 'function';
}