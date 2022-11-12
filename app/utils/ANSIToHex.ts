import rgbToHex from "./rgbToHex";

/**
 * Converts ANSI color to hexadecimal.
 * Expected format: `ESC[{type};2;{r};{g};{b}m`.
 * 
 * `color` must match the following pattern:
 * `^\\.*\[(?:38|48);2;(?<r>\d{1,3});(?<g>\d{1,3});(?<b>\d{1,3})m$`
 * @param color ANSI color
 * @return The hexadecimal color without the "#". Example: "FFAAFF"
 */
export default function ANSIToHex(color:string) {
  const regex = /^\\.*\[(?:38|48);2;(?<r>\d{1,3});(?<g>\d{1,3});(?<b>\d{1,3})m$/;
  const matches = color.match(regex);
  if (matches) {
    const r = parseInt(matches.groups!.r as string, 10);
    const g = parseInt(matches.groups!.g as string, 10);
    const b = parseInt(matches.groups!.b as string, 10);
    return rgbToHex([r,g,b]);
  } else {
    throw new Error("Invalid or unsupported ANSI format.");
  }
}