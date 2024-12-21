import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import {standards} from "./standards"
import { PrismaClient } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const prisma = new PrismaClient()

export async function getTodayStandard() {
  // Get or create the tracker
  let tracker = await prisma.standardTracker.findFirst()
  
  if (!tracker) {
    tracker = await prisma.standardTracker.create({
      data: { currentIndex: 0 }
    })
  }

  // Check if we need to update to next standard
  const lastUpdated = new Date(tracker.lastUpdated)
  const today = new Date()
  
  if (lastUpdated.toDateString() !== today.toDateString()) {
    // Calculate next index with wraparound
    const nextIndex = (tracker.currentIndex + 1) % standards.length
    
    // Update tracker
    tracker = await prisma.standardTracker.update({
      where: { id: tracker.id },
      data: {
        currentIndex: nextIndex,
        lastUpdated: today
      }
    })
  }

  // Return today's standard
  return standards[tracker.currentIndex]
}


export async function getUserById (userId:string) {
  try{
      const user = await prisma.user.findFirst({
      where:{
        id: userId
      },
      select:{
        name:true,
        currentTotalPoints:true,
        socialLinks:true,
        profilepiclink: true
      }
      });
      return user;
  }
  catch(err){
    console.log("user not found ",err);
    throw Error("not able to find user");
  }
}
