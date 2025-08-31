import type { MarkdownBlock } from '../types';

export interface MathBlock extends MarkdownBlock {
  type: 'math';
  display: boolean; // true for block math, false for inline
  latex: string;
}

// Check if line starts a math block
export function isMathBlockStart(line: string): boolean {
  return line.trim() === '$$';
}

// Parse math block
export function parseMathBlock(lines: string[], startIndex: number): {
  block: MathBlock | null;
  endIndex: number;
} {
  const startLine = lines[startIndex];
  
  if (startLine.trim() !== '$$') {
    return { block: null, endIndex: startIndex };
  }
  
  // Look for closing $$
  let content: string[] = [];
  let endIndex = startIndex;
  
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim() === '$$') {
      endIndex = i;
      
      return {
        block: {
          type: 'math',
          display: true,
          latex: content.join('\n'),
          content: content.join('\n'),
          raw: lines.slice(startIndex, endIndex + 1).join('\n')
        },
        endIndex
      };
    }
    
    content.push(line);
  }
  
  // No closing found, treat as regular text
  return { block: null, endIndex: startIndex };
}

// Parse inline math from text (for use in text parser)
export function parseInlineMath(text: string): {
  hasMath: boolean;
  segments: Array<{ type: 'text' | 'math'; content: string }>;
} {
  const segments: Array<{ type: 'text' | 'math'; content: string }> = [];
  let remaining = text;
  let hasMath = false;
  
  // Split by $ signs, but handle escaped \$
  const mathRegex = /(?<!\\)\$([^$]+?)(?<!\\)\$/g;
  let lastIndex = 0;
  let match;
  
  while ((match = mathRegex.exec(text)) !== null) {
    // Add text before math
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      });
    }
    
    // Add math
    segments.push({
      type: 'math',
      content: match[1]
    });
    
    hasMath = true;
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }
  
  return { hasMath, segments };
}