import type { MarkdownBlock } from '../types';

export interface FootnoteReference {
  id: string;
  number: number;
}

export interface FootnoteDefinition extends MarkdownBlock {
  type: 'footnote';
  id: string;
  number: number;
  content: string;
}

// Check if line is a footnote definition [^1]: text
export function isFootnoteDefinition(line: string): boolean {
  return /^\[\^([^\]]+)\]:\s*.+/.test(line);
}

// Parse footnote definition
export function parseFootnoteDefinition(lines: string[], startIndex: number): {
  definition: FootnoteDefinition | null;
  endIndex: number;
} {
  const line = lines[startIndex];
  const match = line.match(/^\[\^([^\]]+)\]:\s*(.+)/);
  
  if (!match) {
    return { definition: null, endIndex: startIndex };
  }
  
  const [, id, content] = match;
  let fullContent = content;
  let endIndex = startIndex;
  
  // Check for continuation lines (indented with spaces or tabs)
  for (let i = startIndex + 1; i < lines.length; i++) {
    const nextLine = lines[i];
    
    // Empty line ends the footnote unless next line is indented
    if (!nextLine.trim()) {
      if (i + 1 < lines.length && /^[\s\t]+/.test(lines[i + 1])) {
        fullContent += '\n';
        continue;
      } else {
        break;
      }
    }
    
    // Indented line continues the footnote
    if (/^[\s\t]+/.test(nextLine)) {
      fullContent += '\n' + nextLine.trimStart();
      endIndex = i;
    } else {
      break;
    }
  }
  
  return {
    definition: {
      type: 'footnote',
      id,
      number: 0, // Will be assigned later
      content: fullContent,
      raw: lines.slice(startIndex, endIndex + 1).join('\n')
    },
    endIndex
  };
}

// Extract all footnote definitions from lines
export function extractFootnoteDefinitions(lines: string[]): {
  definitions: Map<string, FootnoteDefinition>;
  filteredLines: string[];
} {
  const definitions = new Map<string, FootnoteDefinition>();
  const filteredLines: string[] = [];
  let footnoteNumber = 1;
  
  let i = 0;
  while (i < lines.length) {
    if (isFootnoteDefinition(lines[i])) {
      const { definition, endIndex } = parseFootnoteDefinition(lines, i);
      if (definition) {
        definition.number = footnoteNumber++;
        definitions.set(definition.id, definition);
        i = endIndex + 1;
        continue;
      }
    }
    filteredLines.push(lines[i]);
    i++;
  }
  
  return { definitions, filteredLines };
}

// Parse inline footnote references [^1]
export function parseFootnoteReferences(text: string): {
  text: string;
  references: FootnoteReference[];
} {
  const references: FootnoteReference[] = [];
  let referenceNumber = 1;
  
  const processedText = text.replace(/\[\^([^\]]+)\]/g, (match, id) => {
    const number = referenceNumber++;
    references.push({ id, number });
    return `<sup><a href="#fn-${id}" id="fnref-${id}" class="footnote-ref">[${number}]</a></sup>`;
  });
  
  return { text: processedText, references };
}

// Create footnotes section block
export interface FootnotesSection extends MarkdownBlock {
  type: 'footnotes';
  definitions: FootnoteDefinition[];
}

export function createFootnotesSection(definitions: Map<string, FootnoteDefinition>): FootnotesSection | null {
  if (definitions.size === 0) return null;
  
  const sortedDefinitions = Array.from(definitions.values()).sort((a, b) => a.number - b.number);
  
  return {
    type: 'footnotes' as any,
    definitions: sortedDefinitions,
    content: '',
    raw: ''
  };
}