
import { getTodayStandard } from '@/lib/utils'
import { NextResponse } from 'next/server'

export const GET = async () => {
    
  try {
    const standard = await getTodayStandard()
    return new NextResponse(JSON.stringify(standard), {status:200})
  } catch (error) {
    console.error('Error fetching daily standard:', error)
    return new NextResponse(JSON.stringify({message:"Internal server error"}), {status:500})

  }
}
