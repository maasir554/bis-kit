
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import fs from 'fs/promises'
import path from 'path'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gamename: string }> }
) {
  try {
    const { gamename }= await params 
    const session = await auth()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check points requirement for game3
    if (gamename === 'a-gold-story') {
      const userPoints = await prisma.user.findUnique({
        where: { id: session.user?.id },
        select: { currentTotalPoints: true }
      })
      
      if ((userPoints?.currentTotalPoints || 0) < 500) {
        return new NextResponse("Insufficient points", { status: 403 })
      }
    }

    // Get the file path from the URL
    const url = new URL(request.url)
    const fileName = url.searchParams.get('file') || 'index.html'
    
    // Prevent directory traversal attacks
    // const sanitizedgamename = params.gamename.replace(/[^a-zA-Z0-9]/g, '')
    // const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '')
    
    const filePath = path.join(process.cwd(), 'src', 'games',gamename, fileName)
    
    try {
      const content = await fs.readFile(filePath)
      
      // Set content type based on file extension
      const ext = path.extname(fileName)
      const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
      }[ext] || 'text/plain'
      
      return new NextResponse(content, {
        headers: {
          'Content-Type': contentType,
          // Prevent caching
          'Cache-Control': 'no-store, max-age=0',
        }
      })
    } catch (error) {
      return NextResponse.json({message:"File not found", filePath:filePath,error}, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({message:"Internal Error",error}, { status: 500 })
  }
}
