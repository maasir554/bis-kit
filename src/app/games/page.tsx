import { gameCardsData } from "@/components/CONSTANTS"
import { GameCard } from "@/components/GameCard"

export default async function page(){
return(

<section className="w-full h-full min-h-screen flex flex-col mt-32 ">
    <h1 className="text-4xl font-semibold w-full text-center mb-10 ">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-300">
            Games
        </span>
    </h1>
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

)
}