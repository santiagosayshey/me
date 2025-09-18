import type { MarkdownBlock } from '../types';

export interface FrontmatterData {
  title?: string;
  author?: string;
  date?: Date | string;
  tags?: string[];
  categories?: string[];
  description?: string;
  [key: string]: any;
}

export interface FrontmatterBlock extends MarkdownBlock {
  type: 'frontmatter';
  metadata: FrontmatterData;
}

export function extractFrontmatter(content: string): {
  frontmatter: FrontmatterData | null;
  contentWithoutFrontmatter: string;
  frontmatterBlock: FrontmatterBlock | null;
} {
  const lines = content.split('\n');
  
  if (!hasFrontmatter(lines)) {
    return {
      frontmatter: null,
      contentWithoutFrontmatter: content,
      frontmatterBlock: null
    };
  }
  
  const { data, raw, endIndex } = parseFrontmatterSection(lines);
  
  if (!data) {
    return {
      frontmatter: null,
      contentWithoutFrontmatter: content,
      frontmatterBlock: null
    };
  }
  
  const frontmatterBlock: FrontmatterBlock = {
    type: 'frontmatter',
    content: JSON.stringify(data, null, 2),
    raw: raw,
    metadata: data
  };
  
  const contentWithoutFrontmatter = lines.slice(endIndex + 1).join('\n');
  
  return {
    frontmatter: data,
    contentWithoutFrontmatter,
    frontmatterBlock
  };
}

function hasFrontmatter(lines: string[]): boolean {
  return lines.length > 0 && lines[0].trim() === '---';
}

function parseFrontmatterSection(lines: string[]): {
  data: FrontmatterData | null;
  raw: string;
  endIndex: number;
} {
  const endIndex = findFrontmatterEnd(lines);
  
  if (endIndex === -1) {
    return { data: null, raw: '', endIndex: -1 };
  }
  
  const yamlContent = lines.slice(1, endIndex).join('\n');
  const raw = lines.slice(0, endIndex + 1).join('\n');
  
  try {
    const data = parseYAML(yamlContent);
    return { data, raw, endIndex };
  } catch (error) {
    console.error('Failed to parse frontmatter YAML:', error);
    return { data: null, raw, endIndex };
  }
}

function findFrontmatterEnd(lines: string[]): number {
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      return i;
    }
  }
  return -1;
}

function parseYAML(yaml: string): FrontmatterData {
  const result: FrontmatterData = {};
  const lines = yaml.split('\n');
  
  let stack: { obj: any; key: string | null; indent: number }[] = [
    { obj: result, key: null, indent: -1 }
  ];
  
  let inMultiline = false;
  let multilineKey: string | null = null;
  let multilineValue: string[] = [];
  let multilineIndent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.length - line.trimStart().length;
    
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    if (inMultiline) {
      if (trimmed && indent <= multilineIndent) {
        // End of multiline - process this line normally
        const current = stack[stack.length - 1];
        if (multilineKey) {
          current.obj[multilineKey] = multilineValue.join('\n');
        }
        inMultiline = false;
        multilineValue = [];
        multilineKey = null;
        i--; // Re-process this line
        continue;
      } else {
        // Part of multiline content - preserve exact spacing
        multilineValue.push(line.substring(multilineIndent + 2));
      }
    } else {
      // Pop stack to current indent level
      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }
      
      const current = stack[stack.length - 1];
      
      if (trimmed.startsWith('- ')) {
        // Array item
        const value = trimmed.substring(2).trim();
        
        // Find the array we should add to (look for the most recent key with matching indent)
        if (current.key && current.obj && Array.isArray(current.obj[current.key])) {
          current.obj[current.key].push(parseValue(value));
        } else if (stack.length > 1) {
          // Look up the stack for the right array
          for (let j = stack.length - 1; j >= 0; j--) {
            const stackItem = stack[j];
            if (stackItem.key && indent > stackItem.indent) {
              const target = j === 0 ? result : stack[j - 1].obj;
              if (target && stackItem.key) {
                if (!Array.isArray(target[stackItem.key])) {
                  target[stackItem.key] = [];
                }
                target[stackItem.key].push(parseValue(value));
              }
              break;
            }
          }
        }
      } else {
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0) {
          const key = trimmed.substring(0, colonIndex).trim();
          const valueAfterColon = trimmed.substring(colonIndex + 1).trim();
          
          if (valueAfterColon === '|') {
            // Multiline string
            inMultiline = true;
            multilineKey = key;
            multilineIndent = indent;
            multilineValue = [];
          } else if (valueAfterColon) {
            // Direct value
            current.obj[key] = parseValue(valueAfterColon);
          } else {
            // Check if next line is an array (look ahead)
            let isArray = false;
            if (i + 1 < lines.length) {
              const nextLine = lines[i + 1].trim();
              if (nextLine.startsWith('- ')) {
                isArray = true;
              }
            }
            
            if (isArray) {
              // It's going to be an array
              current.obj[key] = [];
              // Keep reference to parent object and the key for the array
              stack.push({ obj: current.obj, key: key, indent: indent });
            } else {
              // Nested object coming next
              current.obj[key] = {};
              stack.push({ obj: current.obj[key], key: key, indent: indent });
            }
          }
        }
      }
    }
  }
  
  if (inMultiline && multilineKey) {
    const current = stack[stack.length - 1];
    if (current.obj) {
      current.obj[multilineKey] = multilineValue.join('\n');
    }
  }
  
  // Clean up empty objects that should be arrays
  cleanupEmptyObjects(result);
  
  return result;
}

function cleanupEmptyObjects(obj: any): void {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      if (Object.keys(obj[key]).length === 0) {
        obj[key] = null;
      } else {
        cleanupEmptyObjects(obj[key]);
      }
    }
  }
}

function parseValue(value: string): any {
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  
  if (value.startsWith('[') && value.endsWith(']')) {
    const items = value.slice(1, -1).split(',').map(item => item.trim());
    return items.map(item => parseValue(item));
  }
  
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;
  
  const num = Number(value);
  if (!isNaN(num) && value !== '') return num;
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  
  return value;
}