"use server";

import { updateUserSocialMediaLink, updateUserName} from "@/actions/socialMedia"
import { redirect } from "next/navigation"

export const linkdeInAction = async(FormData:FormData, id:string)=>{
    // 'use server'
    await updateUserSocialMediaLink(id, "linkedin", FormData.get("profileLink") as string)
    redirect("/profile/"+id)
}
export const XAction = async(FormData:FormData, id:string)=>{
    // 'use server'
    await updateUserSocialMediaLink(id, "twitter", FormData.get("profileLink") as string)
    redirect("/profile/"+id)
}
export const InstagramAction = async(FormData:FormData, id:string)=>{
    // 'use server'
    await updateUserSocialMediaLink(id, "instagram", FormData.get("profileLink") as string)
    redirect("/profile/"+id)
}
export const userNameAction = async(FormData:FormData, id:string)=>{
    // 'use server'
    const newName = FormData.get("newName") as string
    if(!!newName && newName.trim() !== ""){
        await updateUserName(id, newName); 
        redirect("/profile/"+id)
    }
}
