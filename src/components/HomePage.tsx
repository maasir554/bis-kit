// "use client"

// import { X } from "lucide-react"
// import { useState } from "react"

import { GameCard } from "./GameCard"

import { gameCardsData } from "./CONSTANTS"
import Image from "next/image"
import { TopScorers } from "./TopScorers"


export const HomePage = () => (
<main className="flex flex-col justify-center items-center w-full max-w-screen">
    <section id="Home" className="w-full min-h-screen flex flex-col pt-[200px] px-4 justify-start items-center gap-10 bg-gradient-to-b from-black via-sky-950 to-themeblue pb-10">
        
        <div className="flex flex-row items-center justify-center gap-8 flex-wrap w-full">
            
            <div className="relative overflow-visible">
                <Image src="/mascot-wave.gif" width={200} height={200} alt="mascot" className="min-w-[150px] w-[35%] sm:w-[150px] md:w-[180px] lg:w-[200px] mb-14" />
                <span className="absolute top-0 left-[95%] rounded-xl w-auto whitespace-nowrap px-4 py-2  text-4xl font-bold">
                    Hi!
                </span>
            </div>
            
            <span className=" flex flex-col items-center justify-center gap-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold  text-center +md:text-left mx-2 w-full">
                    Learn Indian Standards
                        <br/>Through Gaming
                </h1>
                <p className="text-sm sm:text-md md:text-lg font-normal text-center mx-2 max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl  ">
                BISKit - an interactive web platform designed to create awareness of Indian standards and standardization processes using engaging games
                </p>

            </span>
            

        </div>

        <div id="top-players" className="mt-10 flex flex-col items-center" >
            <h1 className="text-3xl mb-3 w-fit text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                Top scorers
            </h1>
            <p className="text-center w-full mb-10">
                collect highest number of points and become the top scorer!
            </p>

            <TopScorers />

        </div>
        

    </section>

    <section id="games" className="w-full min-h-dvh bg-neutral-950 flex flex-col justify-center items-center bg-[length:100%_auto] bg-[url(/grid-background.png)] bg-no-repeat bg-top px-5 pt-20 lg:pt-20" >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold -translate-y-1/2 text-center mx-2" >
            Featured Games
        </h1>
        <p className="mx-5 text-sm sm:text-md md:text-ld text-center pb-10">
            Play these games to learn about Indian Standards, while  enjoying!
        </p>

        <span className="flex flex-row flex-wrap gap-10 items-center justify-center w-full">
            {/* <GameShowcaseCard/>
            <GameShowcaseCard/>
            <GameShowcaseCard/> */}
            {
                gameCardsData.map(
                    (game,idx) => (
                        <GameCard
                            heading={game.heading}
                            description={game.description}
                            imgLink={game.imgLink}
                            instructions={game.instructions}
                            key={idx}
                            gameLink={game.gameLink}
                        />
                    )
                )
            }
        </span>

    </section>
</main>
)
