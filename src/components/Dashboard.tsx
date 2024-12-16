"use client"

// import { ArrowUpRight } from "lucide-react";
import { StandardOfTheDay } from "./StandardOfTheDay";
import { User } from "next-auth"
// import Link from "next/link";
import { GameCard } from "./GameCard";
import { gameCardsData } from "./CONSTANTS";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar";

interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: User|null|undefined;
  }

export const DashBoard = ({user}:DashboardProps) => {
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
                                        className={"lg:max-w-full min-h-[350px] justify-around md:min-h-[390px]  lg:w-full min-w-0 w-[95%] max-w-[350px] sm:min-w-[190px] lg:min-w-0 sm:w-[30%]"}
                                    />
                                )
                            )
                        }

                    </div>

            </span>
            
            <span id="leaderboard" className="col-start-1 col-span-2 rounded-2xl min-h-[500px] h-full row-start-2 row-end-4 bg-neutral-800 py-6 px-5 md:py-5 md:px-12 flex flex-col justify-start items-center md:items-start">
                    <h1 className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-neutral-400 via-neutral-200 to-neutral-500 w-fit font-semibold mt-2 md:mt-5">
                        Leaderbooard
                    </h1>

                    <Table className="mt-5 text- text-xs md:text-sm">
                      <TableCaption>Play now to have your name here!</TableCaption>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="p-2 sm:p-5">#</TableHead>
                          <TableHead className="p-2 sm:p-4">User</TableHead>
                          <TableHead className="p-2 sm:p-4">Last Played</TableHead>
                          <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-yellow-950 hover:bg-opacity-30 cursor-pointer">
                          <TableCell className="p-2 sm:p-4 font-medium">1</TableCell>
                          <TableCell className="p-2 sm:p-4 flex flex-row items-center gap-4">
                             <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            Babloo Dabloo
                          </TableCell>
                          <TableCell className="p-2 sm:p-4">12:34</TableCell>
                          <TableCell className="text-right">650</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
            </span>

        </div>
    </section>
    )
}
