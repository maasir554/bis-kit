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
