export type BlockType = 
  | 'frontmatter' 
  | 'paragraph' 
  | 'heading' 
  | 'code' 
  | 'list' 
  | 'blockquote' 
  | 'table' 
  | 'html'
  | 'horizontalRule'
  | 'image'
  | 'link';

export interface MarkdownBlock {
  type: BlockType;
  content: string;
  raw: string;
  metadata?: any;
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