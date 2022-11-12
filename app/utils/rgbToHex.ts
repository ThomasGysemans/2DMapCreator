/**
 * Converts RGB or RGBA into its hexadecimal value.
 * @param {string} rgb The string in the RGB or RGBA format.
 * @returns {string} The hexadecimal value as a number.
 */
const rgbToHex = (rgb: string | number[]): string => {
  // Choose correct separator
  rgb = typeof rgb === "string" ? rgb.trim() : rgb;
  const sep = typeof rgb === "string" ? (rgb.indexOf(",") > -1 ? "," : " ") : null;
  const isRGBA = typeof rgb === "string" ? rgb.startsWith("rgba") : rgb.length === 4;
  // Turn "rgb(r,g,b)" into [r,g,b]
  // Turn "rgb(r,g,b,a)" into [r,g,b,a]
  const sequences =
    typeof rgb === "string"
      ? rgb
        .trim()
        .substring(isRGBA ? 5 : 4)
        .split(")")[0]
        .split(sep!)
      : rgb;

  let r = parseInt(sequences[0] as string).toString(16),
    g = parseInt(sequences[1] as string).toString(16),
    b = parseInt(sequences[2] as string).toString(16),
    a = isRGBA
      ? (+sequences[3] >= 1 ? +sequences[3] : Math.floor(+sequences[3] * 255)).toString(16)
      : null;

  if (r.length === 1) r = "0" + r;
  if (g.length === 1) g = "0" + g;
  if (b.length === 1) b = "0" + b;
  if (a?.length === 1) a = "0" + a;

  return r + g + b + (isRGBA ? a : "");
};

export default rgbToHex;