/**
 * Deterministic colour for a tag name, so the same tag always renders the
 * same chip colour across items and the menu — without persisting a colour
 * anywhere. A simple string hash into a fixed palette, not cryptographic.
 */
const PALETTE = [
  '#3bb7f9', // blue
  '#9b8cf0', // violet
  '#4caf7d', // green
  '#f0a04b', // orange
  '#f26d8d', // pink
  '#3fc7c1', // teal
  '#e0b23c', // gold
  '#8d97a8', // slate
];

export function tagColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
