/**
 * Generic string-case conversion utilities.
 *
 * These work on any string but are especially handy for turning
 * enum values (e.g. "DRAFT", "PUBLISHED") into human-friendly text.
 */

/** "hello world" → "hello world" (already lowercase) */
export function toLowerCaseStr(value: string): string {
  return value.toLowerCase();
}

/** "hello world" → "HELLO WORLD" */
export function toUpperCaseStr(value: string): string {
  return value.toUpperCase();
}

/** "HELLO WORLD" / "hello world" / "hELLO wORLD" → "Hello world" */
export function toSentenceCase(value: string): string {
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** "HELLO WORLD" / "hello world" → "Hello World" */
export function toTitleCase(value: string): string {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
