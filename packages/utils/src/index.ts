/**
 * VV Game Suite Utilities
 * 
 * This package provides shared utility functions for the VV Game Suite.
 */

/**
 * Returns a random integer between the specified minimum and maximum values, inclusive.
 *
 * @param min - The lower bound of the range, inclusive.
 * @param max - The upper bound of the range, inclusive.
 * @returns A random integer between {@link min} and {@link max}.
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random floating-point number between the specified minimum and maximum, rounded to a given number of decimal places.
 *
 * @param min - The lower bound of the range, inclusive.
 * @param max - The upper bound of the range, inclusive.
 * @param decimals - Number of decimal places to round the result to (default is 2).
 * @returns A random float between {@link min} and {@link max}, rounded to {@link decimals} decimal places.
 */
export function randomFloat(min: number, max: number, decimals: number = 2): number {
  const value = Math.random() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Generates a random hexadecimal color string in the format #RRGGBB.
 *
 * @returns A random hex color string.
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Generates a random UUID version 4 string.
 *
 * @returns A UUID v4 string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Restricts a number to be within the specified minimum and maximum bounds.
 *
 * @param value - The number to clamp.
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @returns The value constrained between {@link min} and {@link max}.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns the value at a given interpolation factor between two numbers.
 *
 * @param a - The starting value.
 * @param b - The ending value.
 * @param t - The interpolation factor, clamped between 0 and 1.
 * @returns The interpolated value between {@link a} and {@link b}.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param x1 - X coordinate of the first point.
 * @param y1 - Y coordinate of the first point.
 * @param x2 - X coordinate of the second point.
 * @param y2 - Y coordinate of the second point.
 * @returns The distance between the two points.
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Returns the angle in radians between two points.
 *
 * @param x1 - X coordinate of the first point.
 * @param y1 - Y coordinate of the first point.
 * @param x2 - X coordinate of the second point.
 * @param y2 - Y coordinate of the second point.
 * @returns The angle in radians from the first point to the second point, measured counterclockwise from the positive X-axis.
 */
export function angle(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * Converts an angle from radians to degrees.
 *
 * @param radians - The angle in radians.
 * @returns The equivalent angle in degrees.
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Converts an angle from degrees to radians.
 *
 * @param degrees - The angle in degrees.
 * @returns The equivalent angle in radians.
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Returns a debounced version of a function that delays its execution until after a specified wait time has elapsed since the last call.
 *
 * @param func - The function to debounce.
 * @param wait - The delay in milliseconds to wait after the last call before invoking {@link func}.
 * @returns A debounced function that postpones execution of {@link func} until after {@link wait} milliseconds have passed since the last invocation.
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Returns a throttled version of a function that ensures it is called at most once every specified number of milliseconds.
 *
 * @param func - The function to throttle.
 * @param limit - The minimum time interval in milliseconds between allowed calls.
 * @returns A throttled function that invokes {@link func} at most once per {@link limit} milliseconds.
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Returns a new array with the elements randomly shuffled using the Fisher-Yates algorithm.
 *
 * @param array - The array to shuffle.
 * @returns A new array containing the shuffled elements of {@link array}.
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Formats a number as a currency string using the specified currency code and locale.
 *
 * @param value - The numeric value to format.
 * @param currency - The ISO 4217 currency code to use (defaults to 'USD').
 * @param locale - The BCP 47 locale string to use for formatting (defaults to 'en-US').
 * @returns The formatted currency string.
 */
export function formatCurrency(value: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

/**
 * Formats a number with commas as thousand separators.
 *
 * @param value - The number to format.
 * @returns The formatted number string with commas.
 */
export function formatNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Formats a Date object into a string using custom tokens.
 *
 * Supported tokens in the format string are: `YYYY` (year), `MM` (month), `DD` (day), `HH` (hours), `mm` (minutes), and `ss` (seconds).
 *
 * @param date - The date to format.
 * @param format - The format string containing tokens to be replaced. Defaults to `'YYYY-MM-DD'`.
 * @returns The formatted date string with tokens replaced by corresponding date values.
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  // Use a map of tokens to values and perform replacements in order from longest to shortest
  const tokens = {
    'YYYY': year,
    'MM': month,
    'DD': day,
    'HH': hours,
    'mm': minutes,
    'ss': seconds
  };
  
  return Object.entries(tokens)
    .sort((a, b) => b[0].length - a[0].length) // Sort by token length (longest first)
    .reduce((result, [token, value]) => {
      return result.replace(new RegExp(token, 'g'), value);
    }, format);
}

/**
 * Creates a deep clone of the provided value, recursively copying arrays, plain objects, and Date instances.
 *
 * @param obj - The value to clone.
 * @returns A deep copy of {@link obj}.
 *
 * @throws {Error} If the value cannot be cloned (e.g., unsupported object types).
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }
  
if (obj instanceof Object) {
  return Object.keys(obj).reduce((copy: Record<string, any>, key) => {
    copy[key] = deepClone((obj as any)[key]);
    return copy;
  }, {}) as T;
}
  
  throw new Error(`Unable to copy object: ${obj}`);
}

/**
 * Determines whether a value is empty.
 *
 * Returns true for null, undefined, empty strings, empty arrays, or objects with no own properties.
 *
 * @param obj - The value to check for emptiness.
 * @returns True if {@link obj} is considered empty; otherwise, false.
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true;
  }
  
  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj.length === 0;
  }
  
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }
  
  return false;
}

/**
 * Game-specific utilities
 */
export const game = {
  /**
   * Calculate score based on level, combo, and value
   * @param level Current game level
   * @param combo Current combo multiplier
   * @param baseValue Base score value
   * @returns Calculated score
   */
  calculateScore(level: number, combo: number, baseValue: number): number {
    return Math.floor(baseValue * (1 + (level * 0.1)) * Math.max(1, combo * 0.5));
  },
  
  /**
   * Calculate level difficulty
   * @param level Current game level
   * @param baseSpeed Base speed value
   * @returns Calculated difficulty factors
   */
  calculateDifficulty(level: number, baseSpeed: number = 1): { speed: number, density: number } {
    const speedFactor = 1 + (level * 0.08);
    const densityFactor = 1 + (level * 0.05);
    
    return {
      speed: baseSpeed * speedFactor,
      density: Math.min(0.9, densityFactor * 0.1)
    };
  }
};