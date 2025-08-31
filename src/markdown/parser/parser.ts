import type { ParsedMarkdown, MarkdownBlock, ParserOptions } from './types';
import { extractFrontmatter, type FrontmatterData } from './blocks/frontmatter';
import { parseHeading, isHeading } from './blocks/heading';
import { parseHorizontalRule, isHorizontalRule } from './blocks/horizontal-rule';
import { parseList, isListStart } from './blocks/list';
import { parseTable, isTableStart } from './blocks/table';
import { parseCodeBlock, isCodeBlockStart } from './blocks/code';
import { parseQuoteBlock, isQuoteBlockStart } from './blocks/quote';
import { parseImageBlock, isImageBlockStart } from './blocks/image';
import { isTocMarker, createTocBlock } from './blocks/toc';
import type { HeadingBlock } from './blocks/heading';
import { extractLinkDefinitions, isLinkDefinition } from './inline/link';
import { extractFootnoteDefinitions, createFootnotesSection } from './blocks/footnote';
import { parseMathBlock, isMathBlockStart } from './blocks/math';

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
    
    // Extract link definitions first
    const { definitions: linkDefs, filteredLines: linesAfterLinks } = extractLinkDefinitions(lines);
    
    // Extract footnote definitions
    const { definitions: footnoteDefs, filteredLines } = extractFootnoteDefinitions(linesAfterLinks);
    
    // Create a simplified footnote map for token processing
    const footnoteMap = new Map<string, { number: number }>();
    footnoteDefs.forEach((def, id) => {
      footnoteMap.set(id, { number: def.number });
    });
    
    let currentParagraph: string[] = [];
    const allHeadings: HeadingBlock[] = [];
    let tocMarkerIndex: number | null = null;
    
    for (let i = 0; i < filteredLines.length; i++) {
      const line = filteredLines[i];
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        // If we have a paragraph, add it
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
          });
          currentParagraph = [];
        }
        continue;
      }
      
      // Check for TOC marker
      if (isTocMarker(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
          });
          currentParagraph = [];
        }
        
        // Mark where to insert TOC
        tocMarkerIndex = blocks.length;
        // Add placeholder that will be replaced later
        blocks.push({
          type: 'toc',
          content: '',
          raw: line
        });
        continue;
      }
      
      // Check for image block
      if (isImageBlockStart(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
          });
          currentParagraph = [];
        }
        
        const { block: imageBlock, endIndex } = parseImageBlock(filteredLines, i);
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
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
          });
          currentParagraph = [];
        }
        
        const { block: quoteBlock, endIndex } = parseQuoteBlock(filteredLines, i);
        if (quoteBlock) {
          blocks.push(quoteBlock);
          i = endIndex; // Skip to end of quote block
        }
      }
      // Check for math block
      else if (isMathBlockStart(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
          });
          currentParagraph = [];
        }
        
        const { block: mathBlock, endIndex } = parseMathBlock(filteredLines, i);
        if (mathBlock) {
          blocks.push(mathBlock);
          i = endIndex; // Skip to end of math block
        }
      }
      // Check for code block
      else if (isCodeBlockStart(line)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
          });
          currentParagraph = [];
        }
        
        const { block: codeBlock, endIndex } = parseCodeBlock(filteredLines, i);
        if (codeBlock) {
          blocks.push(codeBlock);
          i = endIndex; // Skip to end of code block
        }
      }
      // Check for table start (needs to check next line too)
      else if (isTableStart(filteredLines, i)) {
        // Save any current paragraph first
        if (currentParagraph.length > 0) {
          blocks.push({
            type: 'paragraph',
            content: currentParagraph.join('\n'),
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
          });
          currentParagraph = [];
        }
        
        const { block: tableBlock, endIndex } = parseTable(filteredLines, i);
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
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
          });
          currentParagraph = [];
        }
        
        const { block: listBlock, endIndex } = parseList(filteredLines, i);
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
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
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
            raw: currentParagraph.join('\n'),
            linkDefinitions: linkDefs,
            footnoteDefinitions: footnoteMap
          });
          currentParagraph = [];
        }
        
        const heading = parseHeading(line);
        if (heading) {
          blocks.push(heading);
          allHeadings.push(heading); // Collect headings for TOC
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
        raw: currentParagraph.join('\n'),
        linkDefinitions: linkDefs,
        footnoteDefinitions: footnoteMap
      });
    }
    
    // Replace TOC placeholder with actual TOC block
    if (tocMarkerIndex !== null && blocks[tocMarkerIndex]) {
      blocks[tocMarkerIndex] = createTocBlock(allHeadings);
    }
    
    // Add footnotes section at the end if there are any
    const footnotesSection = createFootnotesSection(footnoteDefs);
    if (footnotesSection) {
      blocks.push(footnotesSection);
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