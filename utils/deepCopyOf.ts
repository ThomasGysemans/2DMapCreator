export default function deepCopyOf(val: any) {
  return JSON.parse(JSON.stringify(val));
}