/**
 * VV Game Suite Localization
 * 
 * This package provides internationalization and localization resources for the VV Game Suite.
 */

/**
 * Supported languages
 */
export const supportedLanguages = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

/**
 * Default language
 */
export const defaultLanguage = 'en';

/**
 * Interface for localized strings
 */
export interface LocalizedStrings {
  [key: string]: string;
}

/**
 * Interface for language data
 */
export interface LanguageData {
  [key: string]: LocalizedStrings;
}

/**
 * English language strings (default)
 */
export const en: LocalizedStrings = {
  // Game UI
  'game.start': 'Start Game',
  'game.pause': 'Pause',
  'game.resume': 'Resume',
  'game.restart': 'Restart',
  'game.quit': 'Quit',
  'game.score': 'Score',
  'game.lives': 'Lives',
  'game.level': 'Level',
  'game.gameOver': 'Game Over',
  'game.victory': 'Victory!',
  
  // Breakout Game
  'breakout.launchBall': 'Click to launch ball',
  'breakout.ballLost': 'Ball lost!',
  'breakout.extraLife': 'Extra life!',
  'breakout.levelComplete': 'Level Complete!',
  
  // Settings
  'settings.title': 'Settings',
  'settings.audio': 'Audio',
  'settings.video': 'Video',
  'settings.controls': 'Controls',
  'settings.language': 'Language',
  'settings.volume': 'Volume',
  'settings.music': 'Music',
  'settings.sfx': 'Sound Effects',
  'settings.fullscreen': 'Fullscreen',
  'settings.apply': 'Apply',
  'settings.cancel': 'Cancel'
};

/**
 * Spanish language strings
 */
export const es: LocalizedStrings = {
  // Game UI
  'game.start': 'Iniciar Juego',
  'game.pause': 'Pausa',
  'game.resume': 'Continuar',
  'game.restart': 'Reiniciar',
  'game.quit': 'Salir',
  'game.score': 'Puntuación',
  'game.lives': 'Vidas',
  'game.level': 'Nivel',
  'game.gameOver': 'Fin del Juego',
  'game.victory': '¡Victoria!',
  
  // Breakout Game
  'breakout.launchBall': 'Clic para lanzar la bola',
  'breakout.ballLost': '¡Bola perdida!',
  'breakout.extraLife': '¡Vida extra!',
  'breakout.levelComplete': '¡Nivel Completado!',
  
  // Settings
  'settings.title': 'Configuración',
  'settings.audio': 'Audio',
  'settings.video': 'Video',
  'settings.controls': 'Controles',
  'settings.language': 'Idioma',
  'settings.volume': 'Volumen',
  'settings.music': 'Música',
  'settings.sfx': 'Efectos de Sonido',
  'settings.fullscreen': 'Pantalla Completa',
  'settings.apply': 'Aplicar',
  'settings.cancel': 'Cancelar'
};

/**
 * All language data
 */
export const languages: LanguageData = {
  en,
  es,
  // Other languages would be added here
};

/**
 * Get a localized string
 * @param key The string key
 * @param lang The language code (defaults to 'en')
 * @returns The localized string or the key if not found
 */
export function getString(key: string, lang: string = defaultLanguage): string {
  const langData = languages[lang] || languages[defaultLanguage];
  return langData[key] || key;
}

/**
 * Format a localized string with variables
 * @param key The string key
 * @param params Object containing variable values
 * @param lang The language code (defaults to 'en')
 * @returns The formatted localized string
 */
export function formatString(key: string, params: Record<string, any>, lang: string = defaultLanguage): string {
  let text = getString(key, lang);
  
  return Object.keys(params).reduce((result, param) => {
    return result.replace(new RegExp(`{${param}}`, 'g'), params[param].toString());
  }, text);
}