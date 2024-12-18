

// import { getTodayStandard } from '@/lib/utils'
import { getCurrentHighestScorers } from '@/lib/score-utils'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export const GET = async () => {
    
  const session = await auth() 

  if(!session) return NextResponse.json({message:"Unauthorized request"},{status:401})

  try {
    // const standard = await getTodayStandard()
    // return NextResponse.json((standard), {status:200})
    const requiredUsers = await getCurrentHighestScorers()
    return NextResponse.json(requiredUsers, {status:200})
  } catch (error) {
    console.error('Error fetching daily standard:', error)
    return NextResponse.json(({message:"Internal server error"}), {status:500})

  }
}
