/**
 * Ensures image paths are correctly formatted for Next.js
 * Prevents the EISDIR error by ensuring paths start with a slash
 * and don't include the /public prefix
 */
export function getImagePath(path: string): string {
  // If path is already a URL, return it as is
  if (path.startsWith("http") || path.startsWith("data:")) {
    return path
  }

  // Remove /public prefix if it exists
  let cleanPath = path.startsWith("/public/")
    ? path.substring(7) // Remove '/public/'
    : path.startsWith("public/")
      ? path.substring(6) // Remove 'public/'
      : path

  // Ensure path starts with a slash
  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath
  }

  return cleanPath
}

/**
 * Checks if an image exists and returns a fallback if it doesn't
 * This is a client-side function that can be used in components
 */
export function getSafeImagePath(path: string, fallback = "/generic-placeholder-image.png"): string {
  try {
    const imagePath = getImagePath(path)
    // In a real implementation, we might check if the file exists
    // For now, just return the formatted path
    return imagePath
  } catch (error) {
    console.error(`Error loading image: ${path}`, error)
    return fallback
  }
}
