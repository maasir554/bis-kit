"use server";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const updateUserSocialMediaLink = async (userId:string,linkName:"linkedin"|"twitter"|"instagram", link:string) => {
    
    const prevRecord = await prisma.socialLinks.findUnique({
        where:{
            userId: userId,
        },
        select:{
            [linkName]:true
        }
    })
    
    if(!!prevRecord && prevRecord.linkedin!==link) await prisma.socialLinks.update(
                        {
                            where:{
                                userId: userId,
                            },
                            data:{
                                [linkName]: link,
                            }
                        }
                    );    
    if (!prevRecord) await prisma.socialLinks.create(
        {
            data:{
                userId:userId,
                [linkName]:link
            }
        });
}

export const updateUserName = async (userId:string,newName:string) => {
    
    const prevRecord = await prisma.user.findUnique({
        where:{
            id: userId,
        },
        select:{
            name:true
        }
    })
    
    if(!!prevRecord && prevRecord.name!==newName && newName !== ""){
        await prisma.user.update(
            {
                where:{
                    id: userId,
                },
                data:{
                    name: newName,
                }
            }
        );
    }
}
