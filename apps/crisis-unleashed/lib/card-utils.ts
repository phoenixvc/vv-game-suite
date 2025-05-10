import { CardRarity } from "@/types/card";
export const VALID_RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'] as const;
type ValidRarity = typeof VALID_RARITIES[number];

/**
 * Get CSS class name for a card rarity
 * @param rarity The card rarity
 * @param styles The CSS module styles object
 * @returns CSS class name for the rarity
 */
export function getRarityClass(
  rarity: CardRarity | undefined,
  styles: Record<`rarity${CardRarity}` | 'rarityCommon', string>
): string {
  if (!rarity || !VALID_RARITIES.includes(rarity)) {
    return styles.rarityCommon; // Default rarity
  }
  
  // Create the key with proper type assertion
 const key = `rarity${rarity}`;
 if (key in styles) {
   return styles[key as keyof typeof styles];
 }
 return styles.rarityCommon;
}

/**
 * Pick a symbol from a list based on the first char of `cardId`.
 */
function getSymbolFromList<T>(list: readonly T[], cardId?: string): T {
  const index = cardId ? cardId.charCodeAt(0) % list.length : 0;
  return list[index];
}

export const VOID_GLYPHS = ["⌀", "∅", "⊖", "⊘", "⦵", "⊝", "⊗", "⊛", "⊜", "⊕"] as const;

/**
 * Get a void-themed glyph based on card ID
 * @param cardId The card ID
 * @returns A void-themed glyph character
 */
export function getVoidGlyph(cardId?: string): string {
  return getSymbolFromList(VOID_GLYPHS, cardId);
}

/**
 * Get a primordial-themed rune based on card ID
 * @param cardId The card ID
 * @returns A primordial-themed rune character
 */
export function getPrimordialRune(cardId?: string): string {
   // Special case for primordial runes since they use a character code range
   const runeIndex = cardId ? cardId.charCodeAt(0) % 20 : 0;
  return String.fromCharCode(0x16A0 + runeIndex);
 }

export const CELESTIAL_SYMBOLS = ["✧", "★", "☆", "✦", "✴", "✷", "✸", "✹", "✺", "✻", "✼", "❋", "❊", "❉", "❈"] as const;
/**
 * Get a celestial-themed symbol based on card ID
 * @param cardId The card ID
 * @returns A celestial-themed symbol character
 */
export function getCelestialSymbol(cardId?: string): string {
  return getSymbolFromList(CELESTIAL_SYMBOLS, cardId);
}

export const TITANBORN_MARKS = ["⚒", "⚔", "⛏", "⛰", "⛓", "⚙", "⚖", "⚓", "⚡"] as const;

/**
 * Get a titanborn-themed mark based on card ID
 * @param cardId The card ID
 * @returns A titanborn-themed mark character
 */
export function getTitanbornMark(cardId?: string): string {
  return getSymbolFromList(TITANBORN_MARKS, cardId);
}

export const ECLIPSED_MARKS = ["◑", "◐", "◓", "◒", "◕", "◖", "◗", "◔", "◙", "◚", "◛"] as const;

/**
 * Get an eclipsed-themed mark based on card ID
 * @param cardId The card ID
 * @returns An eclipsed-themed mark character
 */
export function getEclipsedMark(cardId?: string): string {
  return getSymbolFromList(ECLIPSED_MARKS, cardId);
}

/**
 * Get a cybernetic-themed code based on card ID
 * @param cardId The card ID
 * @returns A formatted cybernetic code
 */
export function getCyberneticCode(cardId?: string): string {
  const core = cardId ? cardId.substring(0, 8) : "0000";
  return `CN-${core}`;
}
