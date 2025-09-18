import { processSpecialCharacters } from '../inline/entities';

export interface TextToken {
  type: 'text' | 'bold' | 'italic' | 'boldItalic' | 'code' | 'strikethrough' | 'link' | 
        'subscript' | 'superscript' | 'highlight' | 'underline' | 'mark' | 'linebreak' | 'html' | 'reference' | 'footnote' | 'math';
  content: string;
  href?: string; // for links
  title?: string; // for links
  tag?: string; // for html elements
  label?: string; // for reference links
  footnoteId?: string; // for footnote references
  footnoteNumber?: number; // for footnote references
}

export function parseInlineText(text: string): TextToken[] {
  const tokens: TextToken[] = [];
  let remaining = text;
  let currentIndex = 0;
  
  while (currentIndex < remaining.length) {
    let matched = false;
    
    // Check for inline code first (it takes precedence)
    const codeMatch = remaining.slice(currentIndex).match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push({
        type: 'code',
        content: codeMatch[1]
      });
      currentIndex += codeMatch[0].length;
      matched = true;
    }
    
    // Check for inline math $...$
    if (!matched) {
      // Look for $ not preceded by backslash
      if (currentIndex === 0 || remaining[currentIndex - 1] !== '\\') {
        const mathMatch = remaining.slice(currentIndex).match(/^\$([^$\n]+?)\$/);
        if (mathMatch) {
          tokens.push({
            type: 'math',
            content: mathMatch[1]
          });
          currentIndex += mathMatch[0].length;
          matched = true;
        }
      }
    }
    
    // Check for strikethrough
    if (!matched) {
      const strikeMatch = remaining.slice(currentIndex).match(/^~~([^~]+)~~/);
      if (strikeMatch) {
        tokens.push({
          type: 'strikethrough',
          content: processSpecialCharacters(strikeMatch[1])
        });
        currentIndex += strikeMatch[0].length;
        matched = true;
      }
    }
    
    // Check for line breaks (two spaces + newline, or backslash + newline, or <br>, or just newline)
    if (!matched) {
      // Check for <br> first (HTML line break)
      const brMatch = remaining.slice(currentIndex).match(/^<br\s*\/?>/);
      if (brMatch) {
        tokens.push({
          type: 'linebreak',
          content: ''
        });
        currentIndex += brMatch[0].length;
        matched = true;
      }
      // Check for two spaces at end of line or backslash at end of line
      else if (remaining.slice(currentIndex).match(/^(  \n|\\\n)/)) {
        const lineBreakMatch = remaining.slice(currentIndex).match(/^(  \n|\\\n)/);
        if (lineBreakMatch) {
          tokens.push({
            type: 'linebreak',
            content: ''
        });
          currentIndex += lineBreakMatch[0].length;
          matched = true;
        }
      }
      // Handle plain newline characters
      else if (remaining[currentIndex] === '\n') {
        tokens.push({
          type: 'linebreak',
          content: ''
        });
        currentIndex += 1;
        matched = true;
      }
    }
    
    // Check for HTML elements
    if (!matched) {
      // <u>underline</u>
      const underlineMatch = remaining.slice(currentIndex).match(/^<u>([^<]+)<\/u>/);
      if (underlineMatch) {
        tokens.push({
          type: 'underline',
          content: processSpecialCharacters(underlineMatch[1])
        });
        currentIndex += underlineMatch[0].length;
        matched = true;
      }
      
      // <mark>highlighted</mark>
      const markMatch = remaining.slice(currentIndex).match(/^<mark>([^<]+)<\/mark>/);
      if (markMatch) {
        tokens.push({
          type: 'mark',
          content: processSpecialCharacters(markMatch[1])
        });
        currentIndex += markMatch[0].length;
        matched = true;
      }
    }
    
    // Check for subscript H~2~O
    if (!matched) {
      const subMatch = remaining.slice(currentIndex).match(/^~([^~]+)~/);
      if (subMatch) {
        tokens.push({
          type: 'subscript',
          content: subMatch[1]
        });
        currentIndex += subMatch[0].length;
        matched = true;
      }
    }
    
    // Check for superscript X^2^
    if (!matched) {
      const supMatch = remaining.slice(currentIndex).match(/^\^([^\^]+)\^/);
      if (supMatch) {
        tokens.push({
          type: 'superscript',
          content: supMatch[1]
        });
        currentIndex += supMatch[0].length;
        matched = true;
      }
    }
    
    // Check for highlighted text ==text==
    if (!matched) {
      const highlightMatch = remaining.slice(currentIndex).match(/^==([^=]+)==/);
      if (highlightMatch) {
        tokens.push({
          type: 'highlight',
          content: processSpecialCharacters(highlightMatch[1])
        });
        currentIndex += highlightMatch[0].length;
        matched = true;
      }
    }
    
    // Check for bold italic combinations
    if (!matched) {
      // Try ***text*** or ___text___ or **_text_** or __*text*__
      const boldItalicMatch = remaining.slice(currentIndex).match(/^(\*\*\*|___|(\*\*_)|(__\*))(.+?)(\*\*\*|___)|(_\*\*)|(\*__)$/);
      if (boldItalicMatch) {
        const content = boldItalicMatch[4] || remaining.slice(currentIndex + 3).match(/^(.+?)(\*\*\*|___)/)?.[1];
        if (content) {
          tokens.push({
            type: 'boldItalic',
            content: processSpecialCharacters(content)
          });
          currentIndex += boldItalicMatch[0].length;
          matched = true;
        }
      }
    }
    
    // Simpler approach for bold italic
    if (!matched) {
      // Check if it starts with *** or ___ or **_ or _**
      if (remaining.slice(currentIndex).startsWith('***') || 
          remaining.slice(currentIndex).startsWith('___')) {
        const endPattern = remaining.slice(currentIndex, currentIndex + 3);
        const endIndex = remaining.indexOf(endPattern, currentIndex + 3);
        if (endIndex !== -1) {
          tokens.push({
            type: 'boldItalic',
            content: processSpecialCharacters(remaining.slice(currentIndex + 3, endIndex))
          });
          currentIndex = endIndex + 3;
          matched = true;
        }
      } else if (remaining.slice(currentIndex).startsWith('**_') || 
                 remaining.slice(currentIndex).startsWith('_**')) {
        const isBoldFirst = remaining.slice(currentIndex).startsWith('**_');
        const endPattern = isBoldFirst ? '_**' : '**_';
        const endIndex = remaining.indexOf(endPattern, currentIndex + 3);
        if (endIndex !== -1) {
          tokens.push({
            type: 'boldItalic',
            content: processSpecialCharacters(remaining.slice(currentIndex + 3, endIndex))
          });
          currentIndex = endIndex + 3;
          matched = true;
        }
      }
    }
    
    // Check for bold (**text** or __text__)
    if (!matched) {
      const boldMatch = remaining.slice(currentIndex).match(/^(\*\*|__)([^*_]+?)\1/);
      if (boldMatch) {
        tokens.push({
          type: 'bold',
          content: processSpecialCharacters(boldMatch[2])
        });
        currentIndex += boldMatch[0].length;
        matched = true;
      }
    }
    
    // Check for italic (*text* or _text_) - but not if followed by another * or _
    if (!matched) {
      const italicMatch = remaining.slice(currentIndex).match(/^(\*|_)([^*_]+?)\1(?!\1)/);
      if (italicMatch) {
        tokens.push({
          type: 'italic',
          content: processSpecialCharacters(italicMatch[2])
        });
        currentIndex += italicMatch[0].length;
        matched = true;
      }
    }
    
    // Check for footnote references [^id]
    if (!matched) {
      const footnoteMatch = remaining.slice(currentIndex).match(/^\[\^([^\]]+)\]/);
      if (footnoteMatch) {
        tokens.push({
          type: 'footnote',
          content: footnoteMatch[1],
          footnoteId: footnoteMatch[1]
        });
        currentIndex += footnoteMatch[0].length;
        matched = true;
      }
    }
    
    // Check for links [text](url "title") or reference links [text][label]
    if (!matched) {
      // Inline link
      const linkMatch = remaining.slice(currentIndex).match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/);
      if (linkMatch) {
        tokens.push({
          type: 'link',
          content: processSpecialCharacters(linkMatch[1]),
          href: linkMatch[2],
          title: linkMatch[3]
        });
        currentIndex += linkMatch[0].length;
        matched = true;
      }
      
      // Reference link [text][label] or [text][]
      if (!matched) {
        const refMatch = remaining.slice(currentIndex).match(/^\[([^\]]+)\](?:\[([^\]]*)\])?/);
        if (refMatch && refMatch[0].includes('][')) {
          tokens.push({
            type: 'reference',
            content: refMatch[1],
            label: refMatch[2] || refMatch[1] // Use text as label if no explicit label
          });
          currentIndex += refMatch[0].length;
          matched = true;
        }
      }
    }
    
    // If no special formatting found, collect plain text
    if (!matched) {
      // Find the next special character
      let nextSpecial = remaining.length;
      const specialChars = ['*', '_', '`', '~', '[', '^', '=', '<', '\n', '$'];
      
      for (const char of specialChars) {
        const idx = remaining.indexOf(char, currentIndex + 1);
        if (idx !== -1 && idx < nextSpecial) {
          nextSpecial = idx;
        }
      }
      
      // Also check for two spaces before newline
      const twoSpacesNewline = remaining.indexOf('  \n', currentIndex);
      if (twoSpacesNewline !== -1 && twoSpacesNewline < nextSpecial) {
        nextSpecial = twoSpacesNewline;
      }
      
      // Check for backslash before newline
      const backslashNewline = remaining.indexOf('\\\n', currentIndex);
      if (backslashNewline !== -1 && backslashNewline < nextSpecial) {
        nextSpecial = backslashNewline;
      }
      
      const plainText = remaining.slice(currentIndex, nextSpecial);
      
      // Process special characters in plain text
      const processedText = processSpecialCharacters(plainText);
      
      // Merge with previous text token if possible
      if (tokens.length > 0 && tokens[tokens.length - 1].type === 'text') {
        tokens[tokens.length - 1].content += processedText;
      } else {
        tokens.push({
          type: 'text',
          content: processedText
        });
      }
      
      currentIndex = nextSpecial;
    }
  }
  
  return tokens;
}

// Helper to recursively parse nested formatting
export function parseNestedText(text: string): TextToken[] {
  const tokens = parseInlineText(text);
  
  // Recursively parse content of formatted tokens (except code)
  return tokens.map(token => {
    if (token.type !== 'code' && token.type !== 'text' && token.content) {
      // For formatted text, parse the inner content for nested formatting
      const innerTokens = parseInlineText(token.content);
      if (innerTokens.length === 1 && innerTokens[0].type === 'text') {
        // No nested formatting, keep as is
        return token;
      }
      // Has nested formatting - for now, return as is
      // In a full implementation, you'd handle nested structures
      return token;
    }
    return token;
  });
}

// Process tokens with link definitions
export function processTokensWithDefinitions(
  tokens: TextToken[], 
  definitions?: Map<string, { url: string; title?: string }>,
  footnoteDefinitions?: Map<string, { number: number }>
): TextToken[] {
  return tokens.map(token => {
    if (token.type === 'reference' && token.label && definitions) {
      const def = definitions.get(token.label.toLowerCase());
      if (def) {
        return {
          type: 'link',
          content: token.content,
          href: def.url,
          title: def.title
        };
      }
    }
    
    if (token.type === 'footnote' && token.footnoteId && footnoteDefinitions) {
      const def = footnoteDefinitions.get(token.footnoteId);
      if (def) {
        return {
          ...token,
          footnoteNumber: def.number
        };
      }
    }
    
    return token;
  });
}