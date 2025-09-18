import type { MarkdownBlock } from '../types';

export interface ImageBlock extends MarkdownBlock {
  type: 'image';
  alt: string;
  src: string;
  title?: string;
  isClickable?: boolean;
  linkUrl?: string;
  position?: 'left' | 'center' | 'right';
}

export function parseImageBlock(lines: string[], startIndex: number): { block: ImageBlock | null; endIndex: number } {
  const line = lines[startIndex].trim();
  
  // Check for image with link: [![alt](src)](url)
  const linkedImageMatch = line.match(/^\[!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\]\(([^)]+)\)$/);
  if (linkedImageMatch) {
    let [, alt, src, title, linkUrl] = linkedImageMatch;
    
    // Extract position from alt text
    let position: 'left' | 'center' | 'right' = 'center';
    const positionMatch = alt.match(/\$position:\s*(left|center|right)/i);
    if (positionMatch) {
      position = positionMatch[1].toLowerCase() as 'left' | 'center' | 'right';
      alt = alt.replace(/\$position:\s*(left|center|right)/i, '').trim();
    }
    
    const block: ImageBlock = {
      type: 'image',
      alt: alt || '',
      src,
      title,
      isClickable: true,
      linkUrl,
      position,
      content: line,
      raw: line,
      metadata: {}
    };
    return { block, endIndex: startIndex };
  }
  
  // Check for regular image: ![alt](src "title")
  const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/);
  if (imageMatch) {
    let [, alt, src, title] = imageMatch;
    
    // Extract position from alt text
    let position: 'left' | 'center' | 'right' = 'center';
    const positionMatch = alt.match(/\$position:\s*(left|center|right)/i);
    if (positionMatch) {
      position = positionMatch[1].toLowerCase() as 'left' | 'center' | 'right';
      alt = alt.replace(/\$position:\s*(left|center|right)/i, '').trim();
    }
    
    const block: ImageBlock = {
      type: 'image',
      alt: alt || '',
      src,
      title,
      position,
      content: line,
      raw: line,
      metadata: {}
    };
    return { block, endIndex: startIndex };
  }
  
  // Check for reference-style image: ![alt][ref]
  const refImageMatch = line.match(/^!\[([^\]]*)\]\[([^\]]+)\]$/);
  if (refImageMatch) {
    let [, alt, ref] = refImageMatch;
    
    // Extract position from alt text
    let position: 'left' | 'center' | 'right' = 'center';
    const positionMatch = alt.match(/\$position:\s*(left|center|right)/i);
    if (positionMatch) {
      position = positionMatch[1].toLowerCase() as 'left' | 'center' | 'right';
      alt = alt.replace(/\$position:\s*(left|center|right)/i, '').trim();
    }
    
    // Look for reference definition in the rest of the document
    for (let i = 0; i < lines.length; i++) {
      const refDefMatch = lines[i].match(new RegExp(`^\\[${ref}\\]:\\s*([^\\s]+)(?:\\s+"([^"]+)")?$`));
      if (refDefMatch) {
        const [, src, title] = refDefMatch;
        const block: ImageBlock = {
          type: 'image',
          alt: alt || '',
          src,
          title,
          position,
          content: line,
          raw: line,
          metadata: { reference: ref }
        };
        return { block, endIndex: startIndex };
      }
    }
  }
  
  return { block: null, endIndex: startIndex };
}

export function isImageBlockStart(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('![') || trimmed.startsWith('[![');
}