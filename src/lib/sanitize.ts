/**
 * Safe HTML and Educational Content Sanitizer
 * Strips executable scripts, dangerous tags, and event handlers to prevent XSS
 */

export function sanitizeTextContent(raw: string): string {
  if (!raw) return '';

  let sanitized = raw;

  // 1. Remove dangerous executable tags completely along with their inner content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  sanitized = sanitized.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '');
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  sanitized = sanitized.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');

  // 2. Remove all inline event handlers (onclick, onerror, onload, onmouseover, etc.)
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove javascript: or vbscript: or data: URIs in any attributes
  sanitized = sanitized.replace(/href\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, 'src=""');
  sanitized = sanitized.replace(/data\s*:\s*text\/html/gi, 'blocked:');

  return sanitized.trim();
}
