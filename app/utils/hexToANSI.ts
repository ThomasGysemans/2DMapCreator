/**
 * Converts hexadecimal color to ANSI color
 * @param color Hexadecimal color: "#FFFFFF" or "FFFFFF"
 * @param foreground ANSI color can represent either foreground color or background color
 * @returns ANSI color
 */
export default function hexToANSI(color: string, foreground=true) {
  if (color.startsWith('#')) color = color.substring(1);
  const r = color.substring(0, 2);
  const g = color.substring(2, 4);
  const b = color.substring(4, 6);
  const type = foreground ? "38" : "48";
  return `\u001b[${type};2;${r};${g};${b}m`;
}