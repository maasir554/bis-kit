import { auth } from "@/auth"
import { updatePlayerTotalPoints } from "@/lib/score-utils"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Optional: Check if user is requesting their own points
  if (session.user.id !== params.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const user = await prisma.user.findUnique({
      
      where: { id: params.userId },
      
      select: {
        id:true,
        currentTotalPoints: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      totalPoints: user.currentTotalPoints,
    })
  } catch (error) {
    console.error('Error fetching user points:', error)
    return NextResponse.json(
      { error: "Failed to fetch points" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { points } = await request.json()
    
    const user = updatePlayerTotalPoints({newTotalPoints:points, userId: params.userId})

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user points:', error)
    return NextResponse.json(
      { error: "Failed to update points" },
      { status: 500 }
    )
  }
}