import ErrorManager from '../managers/ErrorManager';

/**
 * A class that wraps game components with error handling
 */
export class ErrorBoundary {
  private errorManager: ErrorManager;
  private componentName: string;
  
  constructor(errorManager: ErrorManager, componentName: string) {
    this.errorManager = errorManager;
    this.componentName = componentName;
  }
  
  /**
   * Wrap a method with error handling
   * @param method The method to wrap
   * @param context The context to bind the method to
   * @returns A wrapped method that catches errors
   */
  public wrapMethod<T extends (...args: any[]) => any>(
    method: T, 
    context: any = null
  ): (...args: Parameters<T>) => ReturnType<T> | undefined {
    return (...args: Parameters<T>): ReturnType<T> | undefined => {
      try {
        return method.apply(context, args);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;
        this.errorManager.logError(
          `Error in ${this.componentName}.${method.name || 'anonymous'}: ${message}`, 
          stack
        );
        return undefined;
      }
    };
  }
  
  /**
   * Wrap all methods of an object with error handling
   * @param obj The object whose methods to wrap
   * @returns The same object with wrapped methods
   */
  public wrapObject<T extends object>(obj: T): T {
    const prototype = Object.getPrototypeOf(obj);
    const propertyNames = Object.getOwnPropertyNames(prototype)
      .filter(name => 
        name !== 'constructor' && 
        typeof obj[name as keyof T] === 'function'
      );
    
    for (const name of propertyNames) {
      // Use a more specific type for the method
      const key = name as keyof T;
      const originalMethod = obj[key] as unknown;
      
      // Check if it's actually a function before wrapping
      if (typeof originalMethod === 'function') {
        // Use a type assertion to tell TypeScript this is a callable function
        const typedMethod = originalMethod as (...args: any[]) => any;
        (obj as any)[name] = this.wrapMethod(typedMethod, obj);
    }
  }
  
    return obj;
  }
  
  /**
   * Execute a function with error handling
   * @param fn The function to execute
   * @param args Arguments to pass to the function
   * @returns The result of the function or undefined if an error occurred
   */
  public execute<T extends (...args: any[]) => any>(
    fn: T, 
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    try {
      return fn(...args);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.errorManager.logError(
        `Error in ${this.componentName}: ${message}`, 
        stack
      );
      return undefined;
    }
  }
}

export default ErrorBoundary;