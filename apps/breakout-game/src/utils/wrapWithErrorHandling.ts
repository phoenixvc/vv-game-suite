import ErrorManager from '../managers/ErrorManager';

/**
 * Wraps all methods of a manager class with error handling
 * @param manager The manager instance to wrap
 * @param errorManager The error manager instance
 * @param managerName The name of the manager for error reporting
 */
export function wrapManagerWithErrorHandling<T extends object>(
  manager: T, 
  errorManager: ErrorManager, 
  managerName: string
): T {
  // Get all method names from the manager's prototype
  const prototype = Object.getPrototypeOf(manager);
  const methodNames = Object.getOwnPropertyNames(prototype)
    .filter(name => 
      name !== 'constructor' && 
      typeof manager[name as keyof T] === 'function'
    );
  
  // Wrap each method with error handling
  for (const methodName of methodNames) {
    const originalMethod = manager[methodName as keyof T] as unknown as Function;
    
    // Skip if already wrapped
    if ((originalMethod as any).__errorWrapped) continue;
    
    // Replace the method with a wrapped version
    (manager as any)[methodName] = function(...args: any[]) {
      try {
        return originalMethod.apply(manager, args);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;
        errorManager.logError(
          `Error in ${managerName}.${methodName}: ${message}`, 
          stack
        );
        
        // Return a default value based on the return type of the original method
        return undefined;
      }
    };
    
    // Mark as wrapped to avoid double-wrapping
    (manager as any)[methodName].__errorWrapped = true;
  }
  
  return manager;
}

export default wrapManagerWithErrorHandling;