import type { MarkdownBlock } from '../types';

export interface QuoteBlock extends MarkdownBlock {
  type: 'quote';
  blocks: MarkdownBlock[];  // Changed to hold any markdown blocks
  icon?: string;  // Optional icon directive
  author?: string;  // Optional author directive
  audio?: string;  // Optional audio file directive
  link?: string;  // Optional link directive
}

export function parseQuoteBlock(lines: string[], startIndex: number): { block: QuoteBlock | null; endIndex: number } {
  const line = lines[startIndex];
  
  // Check if line starts with '>'
  if (!line.startsWith('>')) {
    return { block: null, endIndex: startIndex };
  }
  
  const quoteLines: string[] = [];
  let endIndex = startIndex;
  let icon: string | undefined;
  let author: string | undefined;
  let audio: string | undefined;
  let link: string | undefined;
  
  // Collect all consecutive lines that start with '>' or are empty within the quote
  for (let i = startIndex; i < lines.length; i++) {
    const currentLine = lines[i];
    
    if (currentLine.startsWith('>')) {
      // Remove the '>' and optional space after it
      const content = currentLine.slice(1).replace(/^ /, '');
      const trimmedContent = content.trim();
      
      // Check for directives (icon or author) - they can appear at the start
      if (trimmedContent.startsWith('$icon:') && !icon) {
        icon = trimmedContent.slice(6).trim();
        // Don't include the icon directive in the content
        endIndex = i;
        continue;
      }
      
      if (trimmedContent.startsWith('$author:') && !author) {
        author = trimmedContent.slice(8).trim();
        // Don't include the author directive in the content
        endIndex = i;
        continue;
      }
      
      if (trimmedContent.startsWith('$audio:') && !audio) {
        audio = trimmedContent.slice(7).trim();
        // Don't include the audio directive in the content
        endIndex = i;
        continue;
      }
      
      if (trimmedContent.startsWith('$link:') && !link) {
        link = trimmedContent.slice(6).trim();
        // Don't include the link directive in the content
        endIndex = i;
        continue;
      }
      
      quoteLines.push(content);
      endIndex = i;
    } else if (currentLine.trim() === '') {
      // Empty line - end of quote block
      // Don't continue the quote across empty lines
      break;
    } else {
      // Non-quote line - end of quote block
      break;
    }
  }
  
  // Parse the content inside the quote using a simplified markdown parser
  // We need to avoid circular dependency, so we'll parse the blocks here
  const blocks = parseQuoteContent(quoteLines);
  
  const block: QuoteBlock = {
    type: 'quote',
    blocks,
    content: quoteLines.join('\n'),
    raw: lines.slice(startIndex, endIndex + 1).join('\n'),
    metadata: {},
    ...(icon && { icon }),
    ...(author && { author }),
    ...(audio && { audio }),
    ...(link && { link })
  };
  
  return { block, endIndex };
}

// Parse content inside a quote block
function parseQuoteContent(lines: string[]): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      i++;
      continue;
    }
    
    // Check for nested quote
    if (line.startsWith('>')) {
      const { block, endIndex } = parseQuoteBlock(lines, i);
      if (block) {
        blocks.push(block);
        i = endIndex + 1;
        continue;
      }
    }
    
    // Check for heading (handle potential leading whitespace)
    const headingMatch = line.match(/^\s*(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const text = headingMatch[2].trim();
      blocks.push({
        type: 'heading',
        level: level,
        text: text,  // This is what the component expects!
        content: text,
        raw: line,
        metadata: { level, text }
      } as any);
      i++;
      continue;
    }
    
    // Check for list item
    if (line.match(/^[\*\-\+]\s+/) || line.match(/^\d+\.\s+/)) {
      // Collect all list items
      const listLines: string[] = [];
      while (i < lines.length && (lines[i].match(/^[\*\-\+]\s+/) || lines[i].match(/^\d+\.\s+/) || lines[i].match(/^\s+/))) {
        listLines.push(lines[i]);
        i++;
      }
      
      // Create a simple list block
      blocks.push({
        type: 'list',
        ordered: listLines[0].match(/^\d+\.\s+/) !== null,
        items: listLines.map(l => ({
          content: l.replace(/^[\*\-\+\d\.]\s+/, '').trim(),
          raw: l
        })),
        content: listLines.join('\n'),
        raw: listLines.join('\n'),
        metadata: {}
      } as any);
      continue;
    }
    
    // Check for code block
    if (line.startsWith('```')) {
      const codeLines: string[] = [line];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        codeLines.push(lines[i]);
        i++;
      }
      
      blocks.push({
        type: 'code',
        language: line.slice(3).trim() || undefined,
        codeType: 'fenced',
        content: codeLines.slice(1, -1).join('\n'),
        raw: codeLines.join('\n'),
        metadata: {}
      } as any);
      continue;
    }
    
    // Default to paragraph
    const paragraphLines: string[] = [];
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith('>') && !lines[i].startsWith('#') && !lines[i].startsWith('```') && !lines[i].match(/^[\*\-\+\d]\s+/)) {
      paragraphLines.push(lines[i]);
      i++;
    }
    
    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: paragraphLines.join('\n'),  // Preserve newlines instead of joining with spaces
        raw: paragraphLines.join('\n'),
        metadata: {}
      });
    }
  }
  
  return blocks;
}

export function isQuoteBlockStart(line: string): boolean {
  return line.startsWith('>');
}