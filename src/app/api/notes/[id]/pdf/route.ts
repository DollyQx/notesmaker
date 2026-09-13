import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Security validation: In real DB, we check server session cookie / JWT & order table
  // Here we validate request headers or mock purchase token
  const authHeader = request.headers.get('x-user-role');
  const userPurchases = request.headers.get('x-purchased-notes') || '';
  const purchasedIds = userPurchases.split(',').map(s => s.trim());

  const isAdmin = authHeader === 'admin';
  const isPurchased = purchasedIds.includes(id) || id === 'note-101' || id === 'note-102'; // default sample notes access

  if (!isAdmin && !isPurchased) {
    return NextResponse.json(
      { error: 'Unauthorized. You must purchase this note before viewing full content.' },
      { status: 403 }
    );
  }

  // Generate clean inline PDF payload representation (or simulated binary buffer)
  const samplePdfContent = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Count 1 /Kids [3 0 R]>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj
4 0 obj <</Length 120>> stream
BT
/F1 24 Tf
50 700 Td
(NotesMaker Protected Document: ${id}) Tj
0 -40 Td
/F1 14 Tf
(Verified Secure Reader - Single User License) Tj
ET
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000246 00000 n 
0000000417 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
490
%%EOF`;

  return new NextResponse(samplePdfContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="notesmaker_${id}.pdf"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
