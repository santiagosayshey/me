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
  | 'toc';

export interface MarkdownBlock {
  type: BlockType;
  content: string;
  raw: string;
  metadata?: any;
  linkDefinitions?: Map<string, any>;
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