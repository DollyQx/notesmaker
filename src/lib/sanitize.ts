/**
 * Safe Educational HTML and Text Content Sanitizer
 * Implements strict allowlist-based filtering to prevent stored XSS, script injection, and unsafe HTML.
 */

// Allowlist of safe educational formatting tags
const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'div', 'span', 'blockquote', 'pre', 'code',
  'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'del',
  'ul', 'ol', 'li', 'mark', 'br', 'hr',
  'sub', 'sup', 'small',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a'
]);

// Allowlist of safe CSS style properties
const ALLOWED_STYLES = new Set([
  'text-align',
  'font-size',
  'font-weight',
  'text-decoration',
  'background-color',
  'color',
  'line-height',
  'margin',
  'margin-top',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'padding',
  'padding-left',
  'padding-right'
]);

/**
 * Validates and filters inline CSS declarations
 */
function filterSafeStyles(styleStr: string): string {
  if (!styleStr) return '';
  const declarations = styleStr.split(';');
  const safeDeclarations: string[] = [];

  for (const decl of declarations) {
    const parts = decl.split(':');
    if (parts.length < 2) continue;
    const property = parts[0].trim().toLowerCase();
    const value = parts.slice(1).join(':').trim();

    // Prevent CSS expressions, behaviors, or url() injection
    if (/expression|javascript|behavior|url\(|@import/i.test(value)) continue;

    if (ALLOWED_STYLES.has(property)) {
      // Validate safe values
      if (/^[a-zA-Z0-9\s#%.,\-()]+$/.test(value)) {
        safeDeclarations.push(`${property}: ${value}`);
      }
    }
  }

  return safeDeclarations.join('; ');
}

/**
 * Sanitizes educational note content
 */
export function sanitizeTextContent(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';

  let sanitized = raw;

  // 1. Multi-pass removal of dangerous tags and their content
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'applet', 'style', 'form', 'input', 'button', 'select', 'textarea', 'svg', 'math', 'link', 'meta', 'base'];
  for (const tag of dangerousTags) {
    const tagRegex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi');
    let prev = '';
    while (prev !== sanitized) {
      prev = sanitized;
      sanitized = sanitized.replace(tagRegex, '');
    }
    // Also remove self-closing or lone opening tags
    sanitized = sanitized.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi'), '');
  }

  // 2. Multi-pass removal of all inline event handlers (on*)
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove javascript:, vbscript:, and data: URIs
  sanitized = sanitized.replace(/href\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, 'src=""');
  sanitized = sanitized.replace(/data\s*:\s*text\/html/gi, 'blocked:');

  // 4. Tag allowlist filter: inspect all HTML tags
  sanitized = sanitized.replace(/<\/?([a-zA-Z0-9]+)(\s+[^>]*)?\/?>/g, (match, tagName, attributes) => {
    const lowerTag = tagName.toLowerCase();

    // If tag is not in safe educational allowlist, strip it
    if (!ALLOWED_TAGS.has(lowerTag)) {
      return '';
    }

    // Closing tag: clean close
    if (match.startsWith('</')) {
      return `</${lowerTag}>`;
    }

    // Opening tag: filter attributes
    if (!attributes || !attributes.trim()) {
      return `<${lowerTag}>`;
    }

    let safeAttrs = '';

    // Style attribute
    const styleMatch = attributes.match(/\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (styleMatch) {
      const rawStyle = styleMatch[1] || styleMatch[2] || '';
      const safeStyle = filterSafeStyles(rawStyle);
      if (safeStyle) {
        safeAttrs += ` style="${safeStyle}"`;
      }
    }

    // Align attribute
    const alignMatch = attributes.match(/\balign\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (alignMatch) {
      const alignVal = (alignMatch[1] || alignMatch[2] || '').toLowerCase();
      if (['left', 'center', 'right', 'justify'].includes(alignVal)) {
        safeAttrs += ` align="${alignVal}"`;
      }
    }

    // Class attribute (only allow safe text utility classes)
    const classMatch = attributes.match(/\bclass(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (classMatch) {
      const rawClass = classMatch[1] || classMatch[2] || '';
      const safeClasses = rawClass
        .split(/\s+/)
        .filter((c: string) => /^[a-zA-Z0-9_\-]+$/.test(c) && !c.includes('javascript') && !c.includes('eval'))
        .join(' ');
      if (safeClasses) {
        safeAttrs += ` class="${safeClasses}"`;
      }
    }

    // Anchor tags: sanitize href and add security flags
    if (lowerTag === 'a') {
      const hrefMatch = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      if (hrefMatch) {
        const hrefVal = (hrefMatch[1] || hrefMatch[2] || '').trim();
        if (/^(https?:\/\/|mailto:|#)/i.test(hrefVal)) {
          safeAttrs += ` href="${hrefVal}" target="_blank" rel="noopener noreferrer"`;
        } else {
          safeAttrs += ` href="#"`;
        }
      }
    }

    const isSelfClosing = match.endsWith('/>') || lowerTag === 'br' || lowerTag === 'hr';
    return `<${lowerTag}${safeAttrs}${isSelfClosing ? ' />' : '>'}`;
  });

  return sanitized.trim();
}
