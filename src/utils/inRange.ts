export function inRange(input: number, min: number, max: number): number {
  input = Math.max(input, min);
  input = Math.min(input, max);

  return input;
}
