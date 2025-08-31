import type { MarkdownBlock } from '../types';

export interface TableCell {
  content: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableRow {
  cells: TableCell[];
}

export interface TableBlock extends MarkdownBlock {
  type: 'table';
  headers: TableCell[];
  rows: TableRow[];
  alignments: ('left' | 'center' | 'right' | null)[];
}

export function parseTable(lines: string[], startIndex: number): { block: TableBlock | null; endIndex: number } {
  // A table needs at least 2 lines: header and separator
  if (startIndex + 1 >= lines.length) {
    return { block: null, endIndex: startIndex };
  }
  
  const headerLine = lines[startIndex];
  const separatorLine = lines[startIndex + 1];
  
  // Check if this looks like a table
  if (!isTableSeparator(separatorLine)) {
    return { block: null, endIndex: startIndex };
  }
  
  // Parse header
  const headers = parseTableRow(headerLine);
  if (headers.length === 0) {
    return { block: null, endIndex: startIndex };
  }
  
  // Parse alignments from separator
  const alignments = parseAlignments(separatorLine);
  
  // Apply alignments to headers
  headers.forEach((header, i) => {
    if (alignments[i]) {
      header.align = alignments[i];
    }
  });
  
  // Parse body rows
  const rows: TableRow[] = [];
  let currentIndex = startIndex + 2;
  
  while (currentIndex < lines.length) {
    const line = lines[currentIndex];
    
    // Stop at empty line or non-table content
    if (!line.trim() || !line.includes('|')) {
      break;
    }
    
    const cells = parseTableRow(line);
    if (cells.length > 0) {
      // Apply alignments to cells
      cells.forEach((cell, i) => {
        if (alignments[i]) {
          cell.align = alignments[i];
        }
      });
      rows.push({ cells });
    }
    
    currentIndex++;
  }
  
  const block: TableBlock = {
    type: 'table',
    headers,
    rows,
    alignments,
    content: lines.slice(startIndex, currentIndex).join('\n'),
    raw: lines.slice(startIndex, currentIndex).join('\n'),
    metadata: { headerCount: headers.length, rowCount: rows.length }
  };
  
  return { block, endIndex: currentIndex - 1 };
}

function isTableSeparator(line: string): boolean {
  // Table separator must have at least one pipe and consist of -, :, |, and spaces
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return false;
  
  // Check if it's a valid separator (contains -, |, :, and spaces only)
  return /^[\s\|:\-]+$/.test(trimmed) && trimmed.includes('-');
}

function parseTableRow(line: string): TableCell[] {
  // Split by pipes, handling escaped pipes
  const parts = line.split(/(?<!\\)\|/);
  const cells: TableCell[] = [];
  
  for (let i = 0; i < parts.length; i++) {
    const content = parts[i].trim();
    // Skip empty first/last cells (from leading/trailing pipes)
    if (i === 0 && !content) continue;
    if (i === parts.length - 1 && !content) continue;
    
    cells.push({
      content: content.replace(/\\\|/g, '|') // Unescape pipes
    });
  }
  
  return cells;
}

function parseAlignments(separatorLine: string): ('left' | 'center' | 'right' | null)[] {
  const parts = separatorLine.split(/(?<!\\)\|/);
  const alignments: ('left' | 'center' | 'right' | null)[] = [];
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    // Skip empty first/last parts
    if (i === 0 && !part) continue;
    if (i === parts.length - 1 && !part) continue;
    
    if (part.startsWith(':') && part.endsWith(':')) {
      alignments.push('center');
    } else if (part.startsWith(':')) {
      alignments.push('left');
    } else if (part.endsWith(':')) {
      alignments.push('right');
    } else {
      alignments.push(null);
    }
  }
  
  return alignments;
}

export function isTableStart(lines: string[], index: number): boolean {
  if (index + 1 >= lines.length) return false;
  
  const currentLine = lines[index];
  const nextLine = lines[index + 1];
  
  // Check if current line has pipes and next line is a separator
  return currentLine.includes('|') && isTableSeparator(nextLine);
}