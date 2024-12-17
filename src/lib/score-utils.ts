import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const updatePlayerTotalPoints = async ({newTotalPoints, userId}:
    {newTotalPoints:number, userId:string})=>{
       //note: returning a promise!
        return prisma.user.update({
            where:{
                id: userId,
            },
            data:{
                currentTotalPoints: newTotalPoints
            }
        })
}

export const storePointRecord = async (
    {value, userId, gameId}:{value:number,userId:string,gameId:string})=>{
        // returning promise pls remember
        return prisma.point.create({
            data:{
                value:value, 
                userId:userId,
                gameId:gameId,
            }
    })
} 


export const getCurrentHighestScorers = async (limit=10) => {
    return prisma.user.findMany(
        {
            take: limit,
            orderBy: {currentTotalPoints: "desc"},
            select:{
                id:true,
                name:true,
                profilepiclink: true,
                currentTotalPoints:true,

            }
        }
    )
}

