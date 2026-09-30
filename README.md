# NotesMaker (Notes-Study Platform)

NotesMaker is a full-stack Next.js and Prisma application designed for university students and educators to browse, preview, buy, and read educational notes and exam preparation materials.

## Features

- **User Authentication & Role Management**: Student registration with Indian mobile number validation (+91 sanitization), bcrypt password hashing, and admin authorization controls.
- **Educational Notes Catalog**: Categorized notes (Engineering, Science, Medical, etc.) with bestsellers, pricing, and demo previews.
- **Secure Demo Preview System**: High-yield sample text and demo PDFs exposed only when explicitly enabled (`demoEnabled = true`).
- **Protected PDF & Content Access**: Full paid notes and PDFs are strictly protected server-side and require active purchase or admin privilege.
- **XSS-Safe HTML Sanitization**: Educational text notes sanitization stripping scripts, inline event handlers, and dangerous tags while preserving safe study content (tables, math formulas, headers).
- **Persistent Server-Side Sessions**: 30-day session tracking in Prisma DB (`UserSession`) with rolling renewal and explicit logout revocation.
- **Razorpay Integration**: Server-side amount validation preventing client-side price tampering.

## Technology Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Database**: Prisma ORM with MySQL
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 & Lucide Icons
- **Security & Utilities**: Zod, BcryptJS, JSONWebToken, Nodemailer, Razorpay SDK

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://user:password@localhost:3306/notes_db"
JWT_SECRET="your_secure_jwt_secret_key_here"
NODE_ENV="development"

# Optional Payment Gateway
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Migration & Seed**:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Run Unit & Authorization Tests**:
   ```bash
   npm test
   ```

## Security Notes

- Master PDF documents must be uploaded into secured storage paths managed by server-side authorization.
- Never commit `.env` files or expose `JWT_SECRET` in public repositories.
- Security vulnerabilities can be reported according to [SECURITY.md](SECURITY.md).
