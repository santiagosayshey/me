import type { MarkdownBlock } from '../types';

export interface ListItem {
  content: string;
  indent: number;
  checked?: boolean; // for task lists
  children?: ListItem[];
}

export interface ListBlock extends MarkdownBlock {
  type: 'list';
  listType: 'ordered' | 'unordered' | 'task';
  items: ListItem[];
}

export function parseList(lines: string[], startIndex: number): { block: ListBlock | null; endIndex: number } {
  const firstLine = lines[startIndex];
  const listType = getListType(firstLine);
  
  if (!listType) {
    return { block: null, endIndex: startIndex };
  }
  
  const items: ListItem[] = [];
  let currentIndex = startIndex;
  
  while (currentIndex < lines.length) {
    const line = lines[currentIndex];
    const lineType = getListType(line);
    
    // Stop if we hit a non-list line (except for nested content)
    if (!lineType && line.trim() && !line.startsWith('  ') && !line.startsWith('\t')) {
      break;
    }
    
    // Empty line might mean end of list (unless next line is indented)
    if (!line.trim()) {
      if (currentIndex + 1 < lines.length) {
        const nextLine = lines[currentIndex + 1];
        if (!nextLine.startsWith('  ') && !nextLine.startsWith('\t') && !getListType(nextLine)) {
          break;
        }
      }
      currentIndex++;
      continue;
    }
    
    // Parse list item
    const item = parseListItem(line);
    if (item) {
      items.push(item);
      currentIndex++;
    } else {
      currentIndex++;
    }
  }
  
  if (items.length === 0) {
    return { block: null, endIndex: startIndex };
  }
  
  // Build hierarchy based on indentation
  const rootItems = buildHierarchy(items);
  
  const block: ListBlock = {
    type: 'list',
    listType: listType,
    items: rootItems,
    content: lines.slice(startIndex, currentIndex).join('\n'),
    raw: lines.slice(startIndex, currentIndex).join('\n'),
    metadata: { listType, itemCount: items.length }
  };
  
  return { block, endIndex: currentIndex - 1 };
}

function getListType(line: string): 'ordered' | 'unordered' | 'task' | null {
  const trimmed = line.trim();
  
  // Task list: - [ ] or - [x]
  if (/^[-*+]\s+\[[x ]\]/i.test(trimmed)) {
    return 'task';
  }
  
  // Unordered list: -, *, or +
  if (/^[-*+]\s+/.test(trimmed)) {
    return 'unordered';
  }
  
  // Ordered list: 1. or 1)
  if (/^\d+[.)]\s+/.test(trimmed)) {
    return 'ordered';
  }
  
  return null;
}

function parseListItem(line: string): ListItem | null {
  const indent = line.length - line.trimStart().length;
  const trimmed = line.trim();
  
  // Task list item
  const taskMatch = trimmed.match(/^[-*+]\s+\[([x ])\]\s*(.*)$/i);
  if (taskMatch) {
    return {
      content: taskMatch[2],
      indent: indent,
      checked: taskMatch[1].toLowerCase() === 'x'
    };
  }
  
  // Unordered list item
  const unorderedMatch = trimmed.match(/^[-*+]\s+(.*)$/);
  if (unorderedMatch) {
    return {
      content: unorderedMatch[1],
      indent: indent
    };
  }
  
  // Ordered list item
  const orderedMatch = trimmed.match(/^\d+[.)]\s+(.*)$/);
  if (orderedMatch) {
    return {
      content: orderedMatch[1],
      indent: indent
    };
  }
  
  return null;
}

function buildHierarchy(items: ListItem[]): ListItem[] {
  if (items.length === 0) return [];
  
  const rootItems: ListItem[] = [];
  const stack: { item: ListItem; indent: number }[] = [];
  
  for (const item of items) {
    // Find the right parent based on indentation
    while (stack.length > 0 && stack[stack.length - 1].indent >= item.indent) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      // Root level item
      rootItems.push(item);
    } else {
      // Child of the last item in stack
      const parent = stack[stack.length - 1].item;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }
    
    // Add current item to stack for potential children
    stack.push({ item, indent: item.indent });
  }
  
  return rootItems;
}

export function isListStart(line: string): boolean {
  return getListType(line) !== null;
}