export type BlockType = 
  | 'frontmatter' 
  | 'paragraph' 
  | 'heading' 
  | 'code' 
  | 'list' 
  | 'quote' 
  | 'blockquote' 
  | 'table' 
  | 'html'
  | 'horizontalRule'
  | 'image'
  | 'link'
  | 'toc'
  | 'footnotes'
  | 'footnote'
  | 'math';

export interface MarkdownBlock {
  type: BlockType;
  content: string;
  raw: string;
  metadata?: any;
  linkDefinitions?: Map<string, any>;
  footnoteDefinitions?: Map<string, { number: number }>;
}

export interface ParsedMarkdown {
  frontmatter: any | null;
  blocks: MarkdownBlock[];
  raw: string;
}

export interface ParserOptions {
  enableFrontmatter?: boolean;
  enableTables?: boolean;
  enableFootnotes?: boolean;
  enableMath?: boolean;
}