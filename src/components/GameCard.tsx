"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export const GameCard = ({heading, description, imgLink, instructions, className}:{heading:string, description:string,imgLink:string, instructions: string[], className?:string|undefined|null}) => 
    {
    
    const {data:session} = useSession();

    const [isDescriptionOpen, setIsDescriptionOpen] = useState<boolean>(false)
    
    return <span className={"flex flex-col rounded-xl bg-stone-800 p-5 gap-5 min-w-[300px] w-1/4 min-h-[100px]"+" "+className}>
           
            <div className={"w-full aspect-[1.35] rounded-lg overflow-hidden flex items-center justify-center"}>
                <img inert={true} className="w-full h-auto" src={imgLink} alt={heading} />
            </div>

            <h1 className = "text-md lg:text-lg xl:text-xl text-white font-semibold">
                {heading}
            </h1>

            <div className="flex flex-col gap-3 font-medium text-xs sm:text-sm md:text-base">

                <button 
                onClick={()=>setIsDescriptionOpen(true)}
                className="active:bg-opacity-85 w-full p-1 py-3 sm-p-2 md:p-3 bg-transparent border-2 border-white rounded-full text-center hover:bg-white hover:text-black  transition-colors whitespace-nowrap" 
                >
                    How to Play
                </button>
                <button className="active:scale-95 w-full p-1 py-3 sm:p-2 md:p-3 bg-gradient-to-r from-themeorange hover:from-themeblue to-themeblue hover:to-themeorange border-2 border-none rounded-full text-center transition-colors whitespace-nowrap" >
                    Play Now
                </button>

            </div>

            {
                isDescriptionOpen&&

                    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-75 z-[100]">
                        
                        <div 
                        onClick={()=>setIsDescriptionOpen(false)}
                        className="absolute z-102 w-screen h-screen backdrop-blur-sm"
                        >

                        </div>
                        
                        <div className="z-[105] relative animate-[show-in_0.2s_ease-out] w-[calc(100%-1rem)] max-w-xl bg-neutral-900 min-h-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-5 rounded-xl flex flex-col justify-center items-start gap-5 border-2 border-neutral-800">
                            <h1 className="font-semibold text-xl md:text-2xl xl:text-3xl text-neutral-200">
                                Card Matching Game
                            </h1>
                            <div className="text-neutral-300">
                                <h2 className="text-lg font-semibold mb-3 text-themeblue" >
                                    Description:
                                </h2>
                                <p className="font-normal text-sm px-3 mb-4">
                                    {/* Card Matching game is a fun game in which you flip cards and match them.
                                    <br/>
                                    you get to know about the BIS standards that exists in different fields 
                                    by playing this game */}
                                    {description}
                                </p>
                                <h2 className="text-lg font-semibold mb-3 text-themeblue" >
                                    Instructions:
                                </h2>
                                <ol className="pl-4">
                                    {/* <li className=" flex flex-row gap-2 mb-1"><span className="h-full text-themeorange">1.</span> <span>click the cards to flip them</span> </li>
                                    <li className=" flex flex-row gap-2 mb-1"><span className="h-full text-themeorange">2.</span> <span>Match the image to the correspoding standard by identifying the name</span> </li>
                                    <li className=" flex flex-row gap-2 mb-1"><span className="h-full text-themeorange">3.</span> <span>Higher Score will be awarded if you complete the game in less amount of time and consuming less number of moves.</span> </li> */}
                                    {instructions.map((instruction, idx)=>
                                            (
                                                <li key={idx} className=" flex flex-row gap-2 mb-1 justify-center"><span className="h-full text-themeorange flex-[0.03]">{idx+1}.</span><span className="flex-1 flex justify-start">{instruction}</span> </li>
                                            )
                                    )}
                                </ol>
                            </div>

                            <Link 
                            href={
                                (session?.user)?"/dashboard":"/login"
                            }
                            className="active:scale-95 w-full p-3 bg-gradient-to-r from-themeorange hover:from-themeblue to-themeblue hover:to-themeorange border-2 border-none rounded-full text-center transition-colors" >
                                Play Now
                            </Link>
                            {/* button to close card */}
                            <button 
                            onClick={()=>setIsDescriptionOpen(false)}
                            className="absolute top-0 right-0 p-1 rounded-full text-themeorange bg-neutral-800 hover:bg-neutral-700 -translate-x-1/2 translate-y-1/2 active:scale-95"
                            >
                                <X/>    
                            </button>
                        </div>
                        
                    </div>
            }



    </span>
}