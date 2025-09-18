import type { MarkdownBlock } from '../types';

export interface HorizontalRuleBlock extends MarkdownBlock {
  type: 'horizontalRule';
}

export function parseHorizontalRule(line: string): HorizontalRuleBlock | null {
  const trimmed = line.trim();
  
  // Check for at least 3 hyphens, asterisks, or underscores
  if (/^-{3,}$/.test(trimmed) || 
      /^\*{3,}$/.test(trimmed) || 
      /^_{3,}$/.test(trimmed)) {
    return {
      type: 'horizontalRule',
      content: '',
      raw: line,
      metadata: {}
    };
  }
  
  return null;
}

export function isHorizontalRule(line: string): boolean {
  const trimmed = line.trim();
  return /^(-{3,}|\*{3,}|_{3,})$/.test(trimmed);
}