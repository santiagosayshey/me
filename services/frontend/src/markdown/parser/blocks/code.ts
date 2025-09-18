import type { MarkdownBlock } from '../types';
import { createHighlighter, type Highlighter } from 'shiki';

export interface CodeBlock extends MarkdownBlock {
  type: 'code';
  language?: string;
  codeType: 'fenced' | 'indented';
  highlighted?: string; // HTML from Shiki
  icon?: string; // Icon name from first line directive
}

// Singleton highlighter instance
let highlighterInstance: Highlighter | null = null;

export async function initHighlighter(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ['everforest-light', 'houston'],
      langs: ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'bash', 'jsx', 'tsx', 'svelte', 'markdown', 'yaml', 'sql', 'diff', 'text']
    });
  }
  return highlighterInstance;
}

export async function highlightCode(code: string, language?: string): Promise<string> {
  try {
    const highlighter = await initHighlighter();
    const lang = language || 'text';
    
    // Check if language is supported, fallback to text if not
    const loadedLangs = highlighter.getLoadedLanguages();
    const finalLang = loadedLangs.includes(lang as any) ? lang : 'text';
    
    // Check if dark mode is active
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
    
    return highlighter.codeToHtml(code, {
      lang: finalLang,
      themes: {
        light: 'everforest-light',
        dark: 'houston'
      },
      defaultColor: isDark ? 'dark' : 'light'
    });
  } catch (error) {
    console.error('Failed to highlight code:', error);
    // Fallback to plain text
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

export function parseCodeBlock(lines: string[], startIndex: number): { block: CodeBlock | null; endIndex: number } {
  const line = lines[startIndex];
  
  // Check for fenced code block
  if (line.startsWith('```') || line.startsWith('~~~')) {
    return parseFencedCodeBlock(lines, startIndex);
  }
  
  // Check for indented code block (4 spaces or tab)
  if (line.startsWith('    ') || line.startsWith('\t')) {
    return parseIndentedCodeBlock(lines, startIndex);
  }
  
  return { block: null, endIndex: startIndex };
}

function parseFencedCodeBlock(lines: string[], startIndex: number): { block: CodeBlock | null; endIndex: number } {
  const startLine = lines[startIndex];
  const fence = startLine.match(/^(`{3,}|~{3,})/)?.[1];
  
  if (!fence) {
    return { block: null, endIndex: startIndex };
  }
  
  // Extract language if specified
  const language = startLine.slice(fence.length).trim() || undefined;
  
  // Find closing fence
  const codeLines: string[] = [];
  let endIndex = startIndex;
  let icon: string | undefined;
  
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for closing fence (must be same type and at least same length)
    if (line.startsWith(fence[0].repeat(fence.length))) {
      endIndex = i;
      break;
    }
    
    // Check for icon directive on first line of code
    if (i === startIndex + 1 && line.trim().startsWith('$icon:')) {
      icon = line.trim().slice(6).trim();
      // Don't include the icon directive in the code content
      continue;
    }
    
    codeLines.push(line);
    endIndex = i;
  }
  
  // If we didn't find a closing fence, treat it as a paragraph
  if (endIndex === lines.length - 1 && !lines[endIndex].startsWith(fence[0].repeat(fence.length))) {
    return { block: null, endIndex: startIndex };
  }
  
  const block: CodeBlock = {
    type: 'code',
    language,
    codeType: 'fenced',
    content: codeLines.join('\n'),
    raw: lines.slice(startIndex, endIndex + 1).join('\n'),
    metadata: { language, codeType: 'fenced' },
    ...(icon && { icon })
  };
  
  return { block, endIndex };
}

function parseIndentedCodeBlock(lines: string[], startIndex: number): { block: CodeBlock | null; endIndex: number } {
  const codeLines: string[] = [];
  let endIndex = startIndex;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // Indented line (4 spaces or tab)
    if (line.startsWith('    ') || line.startsWith('\t')) {
      // Remove 4 spaces or 1 tab
      const content = line.startsWith('    ') ? line.slice(4) : line.slice(1);
      codeLines.push(content);
      endIndex = i;
    }
    // Empty line might continue the code block
    else if (line.trim() === '' && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (nextLine.startsWith('    ') || nextLine.startsWith('\t')) {
        codeLines.push('');
        endIndex = i;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  
  if (codeLines.length === 0) {
    return { block: null, endIndex: startIndex };
  }
  
  const block: CodeBlock = {
    type: 'code',
    codeType: 'indented',
    content: codeLines.join('\n'),
    raw: lines.slice(startIndex, endIndex + 1).join('\n'),
    metadata: { codeType: 'indented' }
  };
  
  return { block, endIndex };
}

export function isCodeBlockStart(line: string): boolean {
  return line.startsWith('```') || 
         line.startsWith('~~~') || 
         line.startsWith('    ') || 
         line.startsWith('\t');
}

// Simple syntax highlighting tokenizer
export interface SyntaxToken {
  type: string;
  content: string;
}

export function tokenizeCode(code: string, language?: string): SyntaxToken[] {
  if (!language) {
    return [{ type: 'plain', content: code }];
  }
  
  // Basic tokenization - in production, you'd use a proper syntax highlighter
  const tokens: SyntaxToken[] = [];
  const patterns: { [key: string]: RegExp } = {
    comment: /^(\/\/.*|\/\*[\s\S]*?\*\/|#.*|<!--[\s\S]*?-->)/,
    string: /^(['"`])(?:[^\\]|\\.)*?\1/,
    number: /^-?\d+\.?\d*/,
    keyword: /^(function|const|let|var|if|else|for|while|return|class|import|export|from|async|await|try|catch|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|declare|abstract|static|public|private|protected|readonly|def|elif|except|finally|lambda|pass|raise|with|yield)\b/,
    boolean: /^(true|false|null|undefined|None|True|False)\b/,
    operator: /^([+\-*/%=<>!&|^~?:]+)/,
    punctuation: /^[{}[\]();,]/,
    function: /^[a-zA-Z_]\w*(?=\()/,
    property: /^[a-zA-Z_]\w*(?=:)/,
    variable: /^[a-zA-Z_]\w*/
  };
  
  let remaining = code;
  while (remaining.length > 0) {
    let matched = false;
    
    for (const [type, pattern] of Object.entries(patterns)) {
      const match = remaining.match(pattern);
      if (match) {
        tokens.push({ type: `token-${type}`, content: match[0] });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      // Match whitespace or any other character
      if (remaining[0].match(/\s/)) {
        const whitespace = remaining.match(/^\s+/)?.[0] || remaining[0];
        tokens.push({ type: 'whitespace', content: whitespace });
        remaining = remaining.slice(whitespace.length);
      } else {
        tokens.push({ type: 'plain', content: remaining[0] });
        remaining = remaining.slice(1);
      }
    }
  }
  
  return tokens;
}