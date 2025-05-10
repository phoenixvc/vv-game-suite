import { CardRarity } from "@/types/card";

/**
 * Get CSS class name for a card rarity
 * @param rarity The card rarity
 * @param styles The CSS module styles object
 * @returns CSS class name for the rarity
 */
export function getRarityClass(rarity: CardRarity | undefined, styles: Record<string, string>): string {
  const validRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  if (!rarity || !validRarities.includes(rarity)) {
    return styles.rarityCommon; // Default rarity
  }
  const key = `rarity${rarity}`;
  return key in styles ? styles[key] : styles.rarityCommon;
}

/**
 * Get a void-themed glyph based on card ID
 * @param cardId The card ID
 * @returns A void-themed glyph character
 */
export function getVoidGlyph(cardId: string | undefined): string {
  const glyphs = ["⌀", "∅", "⊖", "⊘", "⦵", "⊝", "⊗", "⊛", "⊜", "⊕"];
  const glyphIndex = cardId ? cardId.charCodeAt(0) % glyphs.length : 0;
  return glyphs[glyphIndex];
}

/**
 * Get a primordial-themed rune based on card ID
 * @param cardId The card ID
 * @returns A primordial-themed rune character
 */
export function getPrimordialRune(cardId: string | undefined): string {
  const runeIndex = cardId ? cardId.charCodeAt(0) % 20 : 0;
  return String.fromCharCode(8448 + runeIndex);
}

/**
 * Get a celestial-themed symbol based on card ID
 * @param cardId The card ID
 * @returns A celestial-themed symbol character
 */
export function getCelestialSymbol(cardId: string | undefined): string {
  const symbols = ["✧", "★", "☆", "✦", "✴", "✷", "✸", "✹", "✺", "✻", "✼", "❋", "❊", "❉", "❈"];
  const symbolIndex = cardId ? cardId.charCodeAt(0) % symbols.length : 0;
  return symbols[symbolIndex];
}

/**
 * Get a titanborn-themed mark based on card ID
 * @param cardId The card ID
 * @returns A titanborn-themed mark character
 */
export function getTitanbornMark(cardId: string | undefined): string {
  const marks = ["⚒", "⚔", "⛏", "⛰", "⛓", "⚙", "⚖", "⚓", "⚡"];
  const markIndex = cardId ? cardId.charCodeAt(0) % marks.length : 0;
  return marks[markIndex];
}

/**
 * Get an eclipsed-themed mark based on card ID
 * @param cardId The card ID
 * @returns An eclipsed-themed mark character
 */
export function getEclipsedMark(cardId: string | undefined): string {
  const marks = ["◑", "◐", "◓", "◒", "◕", "◖", "◗", "◔", "◙", "◚", "◛"];
  const markIndex = cardId ? cardId.charCodeAt(0) % marks.length : 0;
  return marks[markIndex];
}

/**
 * Get a cybernetic-themed code based on card ID
 * @param cardId The card ID
 * @returns A formatted cybernetic code
 */
export function getCyberneticCode(cardId: string | undefined): string {
  if (cardId) {
    return cardId.substring(0, 8);
  }
  return "CN-0000"; // Static fallback
}
