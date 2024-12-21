"use client"


import { StandardOfTheDay } from "./StandardOfTheDay";
import { User } from "next-auth"

import { GameCard } from "./GameCard";
import { gameCardsData } from "./CONSTANTS";

import { LeaderboardUser } from "./Leaderboard";

import { useEffect, useState } from "react";
import { Leaderboard } from "./Leaderboard";

interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: User|null|undefined;
  }

export const DashBoard = ({user}:DashboardProps) => {

    const [topUsers, setTopUsers] = useState<LeaderboardUser[]|null>(null);
    
    useEffect(()=>{
      (async()=>{
          try{
              const response = await fetch("/api/leaderboard");
              const data = await response.json();
              console.log(data);
              setTopUsers(data);
          }
          catch(error){
            console.log("unsble to get leaderboard data\n", error);
          }
      })()
    },[])

    return(<section id="dashboard" className="w-full min-h-dvh bg-neutral-900 flex flex-col justify-start items-start px-4 sm:px-12 md:px-20 lg:px-28 xl:px-32 pb-20">
        <h1 className="text-neutral-100 text-xl sm:text-2xl md:text-3xl font-semibold mt-24 mb-1">
            Hello, <span className="text-themeorange">{user?.name}</span><br/>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-neutral-200 mb-8">
            Welcome to the dashboard!
        </p>
        <div id="pentogrid"
        className="flex flex-col lg:grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full h-auto "
        >

            <StandardOfTheDay/>

            <span id="games" className="col-start-3 col-span-1 rounded-2xl bg-gradient-to-b from-sky-950 via-sky-800 to-yellow-950 h-fit flex flex-col justify-center items-center row-start-1 row-end-5 gap-5 py-5 px-7">
                    <h1 className=" text-center my-5 lg:text-left lg:mt-0 text-3xl text-neutral-200 font-semibold w-full pl-3">
                        Games
                    </h1>
                    <div className="flex lg:flex-col w-full lg:gap-5 items-center justify-center flex-wrap gap-5">
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
                                        className={"lg:max-w-full min-h-[350px] justify-around md:min-h-[390px]  lg:w-full min-w-0 w-[95%] max-w-[350px] sm:min-w-[190px] lg:min-w-0 sm:w-[30%]"}
                                    />
                                )
                            )
                        }

                    </div>

            </span>
            
            <Leaderboard users={topUsers as LeaderboardUser[]} />
             
        </div>
    </section>
    )
}
