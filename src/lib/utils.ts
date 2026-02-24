/** Remove featuring/production credits from a song title. */
export function removeSongFeat(s: string): string {
  return (
    s
      .replace(/-\s+(feat|with|prod).*/i, "")
      .replace(/(\(|\[)(feat|with|prod)\.?\s+.*(\)|\])$/i, "")
      .trim() || s
  );
}

/** Remove trailing extra info (e.g. " - Remastered") from a title. */
export function removeExtraInfo(s: string): string {
  return s.replace(/\s-\s.*/, "");
}

/** Normalize full-width CJK punctuation and special characters to ASCII equivalents. */
export function normalize(s: string, emptySymbol = true): string {
  let result = s
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/【/g, "[")
    .replace(/】/g, "]")
    .replace(/。/g, ". ")
    .replace(/；/g, "; ")
    .replace(/：/g, ": ")
    .replace(/？/g, "? ")
    .replace(/！/g, "! ")
    .replace(/、|，/g, ", ")
    .replace(/‘|’|′|＇/g, "'")
    .replace(/“|”/g, '"')
    .replace(/〜/g, "~")
    .replace(/·|・/g, "•");
  if (emptySymbol) {
    result = result.replace(/-/g, " ").replace(/\//g, " ");
  }
  return result.replace(/\s+/g, " ").trim();
}

/** Check if a string contains Han (Chinese) characters. */
export function containsHanCharacter(s: string): boolean {
  return /\p{Script=Han}/u.test(s);
}

/** Placeholder for simplified Chinese conversion (currently a no-op). */
export function toSimplifiedChinese(s: string): string {
  return s;
}

/** Capitalize the first letter of a string. */
export function capitalize(s: string): string {
  return s.replace(/^(\w)/, ($1) => $1.toUpperCase());
}
