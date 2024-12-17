// "use client"

// import { X } from "lucide-react"
// import { useState } from "react"

import { GameCard } from "./GameCard"

import { gameCardsData } from "./CONSTANTS"

export const HomePage = () => (
<main className="flex flex-col justify-center items-center w-full max-w-screen">
    <section id="Home" className="w-full min-h-screen flex flex-col justify-center items-center gap-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold -translate-y-1/2 text-center mx-2">
            Learn Indian Standards
                <br/>Through Gaming
        </h1>
        <p className="text-sm sm:text-md md:text-lg font-normal text-center mx-5 max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl -translate-y-1/2 ">
            This will be the home page of the website and can be seen when user is on &quot;/&quot; endpoint while NOT logged in.
            and also on &quot;/Home&quot; endpoint even if the user is logged in
        </p>
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
