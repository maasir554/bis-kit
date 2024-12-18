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
    {value, userId, gameName}:{value:number,userId:string,gameName:string})=>{
        // returning promise pls remember
        
        try{
            const gameHere = await prisma.game.findUnique({
                where:{
                    name: gameName
                },
                select:{
                    id:true
                }
            });

            if(gameHere) return prisma.point.create({
                data:{
                    value:value, 
                    userId:userId,
                    gameId: gameHere?.id
                }
            });
        }
        catch(error){
            console.log(error);
            throw new Error("Internal server eror");
        }
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

