import { google } from 'googleapis';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

const initializeDriveClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
  
  return google.drive({ 
    version: 'v3', 
    auth: oauth2Client 
  });
};

export async function POST(request: Request) {
  try {
    // Parse the FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer and then to Readable stream
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const stream = Readable.from(buffer);

    // Initialize Google Drive client
    const drive = initializeDriveClient();

    // Upload file to Google Drive using stream
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
      },
      media: {
        mimeType: file.type,
        body: stream
      },
      fields: 'id, webViewLink',
    });

    const fileId = response.data.id;

    // Set file permissions to public
    await drive.permissions.create({
      fileId: fileId!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the direct link
    const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;

    // Store in database using Prisma
    const image = await prisma.assetImage.create({
      data: {
        filename: file.name,
        driveId: fileId!,
        directLink,
        contentType: file.type,
      },
    });

    return NextResponse.json({
      message: 'Upload successful',
      image,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
