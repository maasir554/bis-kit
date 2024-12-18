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
import { Link } from "lucide-react";

export const Leaderboard = 

({users}:{users:{id:string, name:string,image:string, lastPlayed:Date, points:number}[]})=> 

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
        {/* <TableRow className="hover:bg-yellow-950 hover:bg-opacity-30 cursor-pointer">
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
        </TableRow> */}
        {
            users.map((user, idx) => (
               <Link key={idx} href={`/profile/${user.id}`}>
                <TableRow className="hover:bg-yellow-950 hover:bg-opacity-30 cursor-pointer">
                  <TableCell className="p-2 sm:p-4 font-medium">{idx+1}</TableCell>
                  <TableCell className="p-2 sm:p-4 flex flex-row items-center gap-4">
                     <Avatar>
                        <AvatarImage src={user.image || "https://github.com/shadcn.png"} alt={user.name} />
                        <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                    {/* Babloo Dabloo */}
                    {user.name}
                  </TableCell>
                  <TableCell className="p-2 sm:p-4">
                    {/* 12:34 */}
                    {/* {user.lastPlayed.} */}
                  </TableCell>
                  <TableCell className="text-right">650</TableCell>
                </TableRow>
               </Link> 
            ))
        }
      </TableBody>
    </Table>
</span>
;

