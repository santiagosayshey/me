import type { ParsedMarkdown, MarkdownBlock, ParserOptions } from './types';
import { extractFrontmatter, type FrontmatterData } from './blocks/frontmatter';
import { parseHeading, isHeading } from './blocks/heading';
import { parseHorizontalRule, isHorizontalRule } from './blocks/horizontal-rule';
import { parseList, isListStart } from './blocks/list';
import { parseTable, isTableStart } from './blocks/table';
import { parseCodeBlock, isCodeBlockStart } from './blocks/code';
import { parseQuoteBlock, isQuoteBlockStart } from './blocks/quote';
import { parseImageBlock, isImageBlockStart } from './blocks/image';

const DEFAULT_OPTIONS: ParserOptions = {
  enableFrontmatter: true,
  enableTables: true,
  enableFootnotes: true,
  enableMath: true
};

export function parseMarkdown(
  content: string, 
  options: ParserOptions = DEFAULT_OPTIONS
): ParsedMarkdown {
  const blocks: MarkdownBlock[] = [];
  let frontmatterData = null;
  let remainingContent = content;
  
  if (options.enableFrontmatter) {
    const { frontmatter, contentWithoutFrontmatter, frontmatterBlock } = extractFrontmatter(content);
    
    if (frontmatterBlock) {
      blocks.push(frontmatterBlock);
      frontmatterData = frontmatter;
      remainingContent = contentWithoutFrontmatter;
    }
  }
  
  // Parse remaining content line by line
  if (remainingContent.trim()) {
    const lines = remainingContent.split('\n');
    let currentParagraph: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        // If we have a paragraph, add it
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n')
          });
          currentParagraph = [];
        }
        continue;
      }
      
      // Check for image block
      if (isImageBlockStart(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n')
          });
          currentParagraph = [];
        }
        
        const { block: imageBlock, endIndex } = parseImageBlock(lines, i);
        if (imageBlock) {
          blocks.push(imageBlock);
          i = endIndex; // Skip to end of image block
        }
      }
      // Check for quote block
      else if (isQuoteBlockStart(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n')
          });
          currentParagraph = [];
        }
        
        const { block: quoteBlock, endIndex } = parseQuoteBlock(lines, i);
        if (quoteBlock) {
          blocks.push(quoteBlock);
          i = endIndex; // Skip to end of quote block
        }
      }
      // Check for code block
      else if (isCodeBlockStart(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n')
          });
          currentParagraph = [];
        }
        
        const { block: codeBlock, endIndex } = parseCodeBlock(lines, i);
        if (codeBlock) {
          blocks.push(codeBlock);
          i = endIndex; // Skip to end of code block
        }
      }
      // Check for table start (needs to check next line too)
      else if (isTableStart(lines, i)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n')
          });
          currentParagraph = [];
        }
        
        const { block: tableBlock, endIndex } = parseTable(lines, i);
        if (tableBlock) {
          blocks.push(tableBlock);
          i = endIndex; // Skip to end of table
        }
      }
      // Check for list start
      else if (isListStart(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n')
          });
          currentParagraph = [];
        }
        
        const { block: listBlock, endIndex } = parseList(lines, i);
        if (listBlock) {
          blocks.push(listBlock);
          i = endIndex; // Skip to end of list
        }
      }
      // Check for horizontal rule
      else if (isHorizontalRule(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n')
          });
          currentParagraph = [];
        }
        
        const hr = parseHorizontalRule(line);
        if (hr) {
          blocks.push(hr);
        }
      }
      // Check for heading
      else if (isHeading(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n')
          });
          currentParagraph = [];
        }
        
        const heading = parseHeading(line);
        if (heading) {
          blocks.push(heading);
        }
      } else {
        // Add to current paragraph - preserve original line for line break detection
        currentParagraph.push(line);
      }
    }
    
    // Add any remaining paragraph
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: currentParagraph.join(' '),
        raw: currentParagraph.join('\n')
      });
    }
  }
  
  return {
    frontmatter: frontmatterData,
    blocks,
    raw: content
  };
}

export async function loadAndParseMarkdown(
  filePath: string,
  options: ParserOptions = DEFAULT_OPTIONS
): Promise<ParsedMarkdown> {
  const response = await fetch(filePath);
  
  if (!response.ok) {
    throw new Error(`Failed to load markdown file: ${filePath} (${response.status})`);
  }
  
  const content = await response.text();
  return parseMarkdown(content, options);
}

export { extractFrontmatter } from './blocks/frontmatter';
export * from './types';