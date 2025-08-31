import type { MarkdownBlock } from '../types';

export interface HeadingBlock extends MarkdownBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export function parseHeading(line: string): HeadingBlock | null {
  // Check for ATX-style headings (# heading)
  const match = line.match(/^(#{1,6})\s+(.+?)(?:\s*#*)?$/);
  
  if (!match) return null;
  
  const level = match[1].length as 1 | 2 | 3 | 4 | 5 | 6;
  const text = match[2].trim();
  
  return {
    type: 'heading',
    level,
    text,
    content: text,
    raw: line,
    metadata: { level, text }
  };
}

export function isHeading(line: string): boolean {
  return /^#{1,6}\s+/.test(line);
}