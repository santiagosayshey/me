export interface LinkNode {
  type: 'link';
  text: string;
  url: string;
  title?: string;
}

export interface ReferenceLink {
  type: 'reference';
  text: string;
  label: string;
}

export interface LinkDefinition {
  label: string;
  url: string;
  title?: string;
}

// Parse inline links: [text](url) or [text](url "title")
export function parseInlineLinks(text: string): string {
  const inlineLinkRegex = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g;
  
  return text.replace(inlineLinkRegex, (match, linkText, url, title) => {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${url}"${titleAttr} class="text-blue-600 dark:text-blue-400 hover:underline">${linkText}</a>`;
  });
}

// Parse reference links: [text][label] or [text][]
export function parseReferenceLinks(text: string, definitions: Map<string, LinkDefinition>): string {
  // Handle [text][label] format
  let result = text.replace(
    /\[([^\]]+)\]\[([^\]]*)\]/g,
    (match, linkText, label) => {
      const key = (label || linkText).toLowerCase();
      const def = definitions.get(key);
      
      if (def) {
        const titleAttr = def.title ? ` title="${def.title}"` : '';
        return `<a href="${def.url}"${titleAttr} class="text-blue-600 dark:text-blue-400 hover:underline">${linkText}</a>`;
      }
      
      return match; // Return original if no definition found
    }
  );
  
  // Handle [text] shorthand (where text is also the label)
  result = result.replace(
    /\[([^\]]+)\](?!\[|\()/g,
    (match, linkText) => {
      const key = linkText.toLowerCase();
      const def = definitions.get(key);
      
      if (def) {
        const titleAttr = def.title ? ` title="${def.title}"` : '';
        return `<a href="${def.url}"${titleAttr} class="text-blue-600 dark:text-blue-400 hover:underline">${linkText}</a>`;
      }
      
      return match; // Return original if no definition found
    }
  );
  
  return result;
}

// Extract link definitions from markdown: [label]: url "title"
export function extractLinkDefinitions(lines: string[]): {
  definitions: Map<string, LinkDefinition>;
  filteredLines: string[];
} {
  const definitions = new Map<string, LinkDefinition>();
  const filteredLines: string[] = [];
  const definitionRegex = /^\[([^\]]+)\]:\s*([^\s]+)(?:\s+"([^"]+)")?$/;
  
  for (const line of lines) {
    const match = line.match(definitionRegex);
    
    if (match) {
      const [, label, url, title] = match;
      definitions.set(label.toLowerCase(), {
        label,
        url,
        title
      });
    } else {
      filteredLines.push(line);
    }
  }
  
  return { definitions, filteredLines };
}

// Process all links in text (both inline and reference)
export function processLinks(text: string, definitions: Map<string, LinkDefinition>): string {
  // First process reference links, then inline links
  let result = parseReferenceLinks(text, definitions);
  result = parseInlineLinks(result);
  return result;
}

// Check if a line is a link definition
export function isLinkDefinition(line: string): boolean {
  return /^\[([^\]]+)\]:\s*([^\s]+)/.test(line);
}