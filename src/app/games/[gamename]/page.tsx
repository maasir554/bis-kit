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
            <section className="w-full h-screen pt-14 md:pt-20 pb-5 flex flex-col justify-center items-center">
                <GameWindow gamename={gamename} />
            </section>
            :
            redirect("/login")
        }
    </>
            
    )
}

