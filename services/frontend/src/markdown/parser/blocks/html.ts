import type { MarkdownBlock } from '../types';

export interface HTMLBlock extends MarkdownBlock {
  type: 'html';
}

export function parseHTMLBlock(lines: string[], startIndex: number): { block: HTMLBlock | null; endIndex: number } {
  const line = lines[startIndex];
  if (!line.trim().startsWith('<')) {
    return { block: null, endIndex: startIndex };
  }

  const htmlLines: string[] = [];
  let endIndex = startIndex;

  for (let i = startIndex; i < lines.length; i++) {
    const currentLine = lines[i];
    if (currentLine.trim().startsWith('<')) {
      htmlLines.push(currentLine);
      endIndex = i;
    } else {
      break;
    }
  }

  const block: HTMLBlock = {
    type: 'html',
    content: htmlLines.join('\n'),
    raw: htmlLines.join('\n'),
    metadata: {},
  };

  return { block, endIndex };
}

export function isHTMLBlockStart(line: string): boolean {
  return line.trim().startsWith('<');
}
