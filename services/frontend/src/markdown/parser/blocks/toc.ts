import type { MarkdownBlock } from '../types';
import type { HeadingBlock } from './heading';

export interface TocBlock extends MarkdownBlock {
  type: 'toc';
  headings: Array<{
    level: number;
    text: string;
    id: string;
  }>;
}

export function parseToc(line: string): { isToc: boolean } {
  // Check for [[TOC]] or [TOC] marker
  const trimmed = line.trim();
  return {
    isToc: trimmed === '[[TOC]]' || trimmed === '[TOC]' || trimmed === '# Table of Contents'
  };
}

export function isTocMarker(line: string): boolean {
  const trimmed = line.trim();
  return trimmed === '[[TOC]]' || trimmed === '[TOC]' || trimmed === '# Table of Contents';
}

export function createTocBlock(headings: HeadingBlock[]): TocBlock {
  return {
    type: 'toc',
    headings: headings.map(h => ({
      level: h.level,
      text: h.text,
      id: h.id
    })),
    content: '',
    raw: '[[TOC]]',
    metadata: {}
  };
}