# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability within `notesmaker`, please send an email to the maintainers rather than creating a public issue.

All security vulnerabilities will be promptly addressed.

## Security Practices & Design Controls

1. **Authentication & Session Security**:
   - HTTP-only cookies for JWT session tokens.
   - Persistent server-side sessions stored in database (`UserSession`) with explicit revocation capability.
   - BCrypt hashing for all user passwords.

2. **Access Control & Authorization**:
   - Master PDF files are strictly protected and stored outside public access.
   - Demo previews require explicit `demoEnabled = true` flags.
   - Unauthenticated/unauthorized users cannot access paid PDF assets.

3. **Input Sanitization & Data Protection**:
   - Educational text notes are sanitized against XSS vectors using strict HTML white-listing (`sanitizeTextContent`).
   - Phone numbers, user inputs, and payment amounts are validated server-side.
   - Strict basename extraction prevents Path Traversal attacks.
