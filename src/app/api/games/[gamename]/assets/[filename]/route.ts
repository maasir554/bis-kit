

import { auth } from "@/auth"
import { NextResponse } from "next/server"
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string, gamename:string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
      

    // Get the file path from the URL

    const {filename, gamename} = await params; 

    // const url = new URL(request.url)
      
    const filePath = path.join(process.cwd(), 'src', 'games', gamename,"assets", filename)
    
    try {
      const content = await fs.readFile(filePath)
      
      // Set content type based on file extension
      const ext = path.extname(filename)
      
      const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
      }[ext] || 'text/plain'
      
      return new NextResponse(content, {
        headers: {
          'Content-Type': contentType,
          // Prevent caching
          'Cache-Control': 'no-store, max-age=0',
        }
      })
    } catch (error) {
      return NextResponse.json({message:"File not found", filePath:filePath, error}, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({heading:"Internal Error", error:error}, { status: 500 })
  }
}

