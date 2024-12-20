// "use client"

// import { X } from "lucide-react"
// import { useState } from "react"

import { GameCard } from "./GameCard"

import { gameCardsData } from "./CONSTANTS"
import Image from "next/image"

export const HomePage = () => (
<main className="flex flex-col justify-center items-center w-full max-w-screen">
    <section id="Home" className="w-full min-h-screen flex flex-col pt-[200px] justify-start items-center gap-10 bg-gradient-to-b from-black via-sky-950 to-themeblue px-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold -translate-y-1/2 text-center mx-2">
            Learn Indian Standards
                <br/>Through Gaming
        </h1>
        <p className="text-sm sm:text-md md:text-lg font-normal text-center mx-5 max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl -translate-y-1/2 ">
        BISKit - an interactive web platform designed to create awareness of Indian standards and standardization processes using engaging games
        </p>

        <Image src="/mascot-wave.gif" width={200} height={200} alt="mascot" className="min-w-[150px] w-[35%] sm:w-[150px] md:w-[180px] lg:w-[200px] mb-14" />
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
