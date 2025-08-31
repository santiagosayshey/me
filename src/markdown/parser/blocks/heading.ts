import type { MarkdownBlock } from '../types';

export interface HeadingBlock extends MarkdownBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  id: string;
}

// Helper function to generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .trim();
}

export function parseHeading(line: string): HeadingBlock | null {
  // Check for ATX-style headings (# heading)
  const match = line.match(/^(#{1,6})\s+(.+?)(?:\s*#*)?$/);
  
  if (!match) return null;
  
  const level = match[1].length as 1 | 2 | 3 | 4 | 5 | 6;
  const text = match[2].trim();
  const id = generateSlug(text);
  
  return {
    type: 'heading',
    level,
    text,
    id,
    content: text,
    raw: line,
    metadata: { level, text, id }
  };
}

export function isHeading(line: string): boolean {
  return /^#{1,6}\s+/.test(line);
}