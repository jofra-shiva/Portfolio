import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create the multipart form data for Catbox.moe
    const catboxForm = new FormData();
    catboxForm.append('reqtype', 'fileupload');
    catboxForm.append('fileToUpload', file);

    // Forward the file upload from the server side to bypass CORS
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: catboxForm,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Upload service error: ${errorText}` }, { status: 500 });
    }

    const fileUrl = await response.text();
    return NextResponse.json({ url: fileUrl.trim() });
  } catch (err: any) {
    console.error('Server-side upload error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
