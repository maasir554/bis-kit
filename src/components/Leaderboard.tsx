import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Skeleton } from "./ui/skeleton";

import Link from "next/link";
import Image from "next/image";

export interface LeaderboardUser {id:string, name:string,profilepiclink:string, currentTotalPoints:number} 
export const Leaderboard = 

({users}:{users:LeaderboardUser[]})=> 
{
  const getLeagueColor = (userPoints:number) => userPoints>50 ? "yellow-500" : userPoints>25? "zinc-400" : "yellow-900";
  
  return <span id="leaderboard" className="col-start-1 col-span-2 rounded-2xl min-h-[500px] h-full row-start-2 row-end-4 bg-neutral-800 py-6 px-5 md:py-5 md:px-12 flex flex-col justify-start items-center md:items-start">
            <h1 className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-neutral-400 via-neutral-200 to-neutral-500 w-fit font-semibold mt-2 md:mt-5">
                Leaderboard
            </h1>
            {
                !!users
                ? 
            <Table className="mt-5 text- text-xs md:text-sm">
              <TableCaption>Play now to have your name here!</TableCaption>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="p-2 sm:p-5">#</TableHead>
                  <TableHead className="p-2 sm:p-4">User</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {
              users.map((user, idx) => (
                <TableRow key={idx} className={`hover:bg-${getLeagueColor(user.currentTotalPoints)} hover:bg-opacity-20 cursor-pointer`}>
                      <TableCell className="p-2 sm:p-4 font-medium">{idx+1}</TableCell>
                      <TableCell className="p-2 sm:p-4 w-full">
                      <Link className="flex flex-row items-center gap-4" href={`/profile/${user.id}`}>

                      <Image className={`rounded-full w-10 md:w-12 lg:w-14 p-[1px] border-4 border-${getLeagueColor(user.currentTotalPoints)}`} alt={user.name} src= {user.profilepiclink || "https://github.com/shadcn.png"} width={50} height={50} />
                         {/* <Avatar>
                            <AvatarImage src={user.profilepiclink || "https://github.com/shadcn.png"} alt={user.name} />
                            <AvatarFallback>{user.name}</AvatarFallback>
                        </Avatar> */}
                        {user.name}
                    </Link> 
                      </TableCell>
                      <TableCell className="text-right">{user.currentTotalPoints}</TableCell>
                    </TableRow>
                ))
              }
              </TableBody>
            </Table>
                :
                <Skeleton className="w-full h-20 opacity-25 mt-7"></Skeleton>
              }
        </span>
}

export const tw_include = () => 
<div className="hover:bg-yellow-900 hover:bg-yellow-500 hover:bg-zinc-400 hover:bg-zinc-400 border-yellow-500 border-yellow-900 border-zinc-400">

</div>; 



