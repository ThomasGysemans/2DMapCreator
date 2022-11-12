export default function hexToRgb(hex:string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result == null) {
    throw new Error("Invalid hexadecimal format for color '" + hex + "'");
  }
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}