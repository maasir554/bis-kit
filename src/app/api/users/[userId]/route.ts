
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const {userId} = await params;
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Optional: Check if user is requesting their own points
  if (session.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const user = await prisma.user.findUnique({
      
      where: { id: userId },
      
      select: {
        id:true,
        name:true,
        profilepiclink:true,
        currentTotalPoints: true,
        socialLinks: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      totalPoints: user,
    })
  } catch (error) {
    console.error('Error fetching user points:', error)
    return NextResponse.json(
      { error: "Failed to fetch points" },
      { status: 500 }
    )
  }
}

