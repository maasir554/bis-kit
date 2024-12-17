// "use client";
import { GameWindow } from "@/components/GameWindow";
import { auth } from "@/auth"
import { redirect } from "next/navigation";
// import { useSession } from "next-auth/react";
// import {use} from "react";

export default async function Page({params}:{params:Promise<{gamename:string}>}){

    // const {gamename} = use(params)
    const {gamename} = await params; 
    const session = await auth()
    return(
    <>
        {
            session?.user
            ?
            <GameWindow gamename={gamename} />
            :
            redirect("/login")
        }
    </>
            
    )
}

