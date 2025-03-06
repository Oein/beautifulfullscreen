export function removeSongFeat(s: string) {
  return (
    s
      .replace(/-\s+(feat|with|prod).*/i, "")
      .replace(/(\(|\[)(feat|with|prod)\.?\s+.*(\)|\])$/i, "")
      .trim() || s
  );
}
export function removeExtraInfo(s: string) {
  return s.replace(/\s-\s.*/, "");
}

export function normalize(s: string, emptySymbol = true) {
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

export function containsHanCharacter(s: string) {
  const hanRegex = /\p{Script=Han}/u;
  return hanRegex.test(s);
}

export function toSimplifiedChinese(s: string) {
  return s;
}
export function capitalize(s: string) {
  return s.replace(/^(\w)/, ($1) => $1.toUpperCase());
}
