"use client";

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X } from "lucide-react";

import { signOut } from "next-auth/react";

import { MouseEventHandler, useEffect, useState } from "react";

import { useTotalPointsStore } from "@/app/stores/pointsStore";

// import { useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Skeleton } from "./ui/skeleton";

import { User } from "next-auth";



const LoginSignupBox = ({onClick}:{onClick:MouseEventHandler}) => (
  <span className="flex flex-row gap-2 items-center justify-center font-normal">
  <Link onClick={onClick} href="/signup" className="hover:underline px-4 py-4 md:py-2 rounded-full bg-transparent active:scale-95">
    Signup
  </Link>

  <Link onClick={onClick} href="/login" className="hover:underline px-8 md:px-6 py-3 md:py-2 lg:px-10 rounded-full bg-gradient-to-r from-themeblue to-themeorange hover:from-themeorange hover:bg-themeblue bg-opacity-75 active:scale-95">
    Login
  </Link>
</span>
);

const UserProfileBox = ({userFromProps}:{userFromProps:User}) => {

  const user = userFromProps;

  const TotalPointsStore = useTotalPointsStore()


  useEffect(
    ()=>{
      (async()=>{
        if(user.id) await TotalPointsStore.fetchTotalPoints(user.id);
      })()
    },[user.id]
  )

  
  // const [userCurrentTotalPoints, setUserCurrentTotalPoints] = useState(null);

  // useEffect(()=>{
  //   (async()=>{
  //     const responseOfGetTotalPoints = await fetch(`/api/users/${user.id}/points`);
      
  //     if(!responseOfGetTotalPoints.ok) throw new Error ("Failed to get total points");
      
  //     const dataOfGetTotalPoints = await responseOfGetTotalPoints.json();
      
  //     console.log("total points from database ",dataOfGetTotalPoints);

  //     const {totalPoints} = dataOfGetTotalPoints;

  //     setUserCurrentTotalPoints(totalPoints);
    
  //   })()
  // },[])

  const [bgClassName, setBgClassName] = useState<string|null>("bg-neutral-900");

  useEffect(()=>{
        !TotalPointsStore.isLoading && setBgClassName(
          TotalPointsStore.totalPoints > 50
          ?
          "bg-gradient-to-br from-yellow-500 to-yellow-700"
          :
          TotalPointsStore.totalPoints > 25
          ?
          "bg-gradient-to-br from-zinc-400 to-zinc-600"
          :
          "bg-yellow-950"
          
        )
  },[TotalPointsStore.totalPoints])

  return (
      <DropdownMenu>
        <DropdownMenuTrigger className={"flex flex-row justify-center gap-2 py-1 pl-5 rounded-full "+ bgClassName}>
        
        <span className="flex flex-row gap-2 justify-center items-center h-full">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 border-black border-2">
            </span>
            <div className="text-white font-semibold text-sm min-w-7 text-start">
                {/* {userCurrentTotalPoints || 0} */} {/* not doing this, using skeliton instead*/}
                {
                  // userCurrentTotalPoints!==null
                  TotalPointsStore.isLoading
                  ?
                  <Skeleton className="w-5 h-4 opacity-25"/>
                  :
                  <span>{TotalPointsStore.totalPoints}</span>
                }
            </div>
        </span>
        
        <Avatar className="w-16 h-16 md:w-10 md:h-10" >         
            <AvatarImage src= {user.image ? (user.image) : "https://github.com/shadcn.png"} />  
           <AvatarFallback>{user?.name}</AvatarFallback>
           </Avatar>
        </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 text-white border-neutral-600 px-5 py-5">
          <DropdownMenuLabel className="flex flex-col gap-2">
            <h1 className="text-xl">
              {user?.name}
            </h1> 
            <p className="text-sm font-normal text-neutral-400">
              {user?.email}<br/>
              id: {user.id}<br/>
              {/* image: {user.image} */}
            </p> 
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-neutral-600"/>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={()=>signOut()} className="text-red-400 hover:text-red-900 hover:bg-black">
              Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export const NavBar = ({userFromProps}:{userFromProps:User|undefined|null}) => {

  // use the session to get auth details like user name, email, and image
  // const {data:session} = useSession()
  // const user = session?.user;
// 
  const user = userFromProps

  // state of navbar [mobile devices]

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleMenuOpen = () => setIsOpen(isOpen => !isOpen);

  useEffect(()=>{
    window.addEventListener("resize", ()=> {
      if(window.innerWidth>=768) setIsOpen(false);
    })
  },[])

  return(
        <nav className={`overflow-hidden z-50 backdrop-blur-lg fixed left-1/2 -translate-x-1/2 bg-opacity-10 bg-neutral-200 flex flex-row items-center gap-4 lg:gap-6 xl:gap-10 w-11/12 md:w-10/12 rounded-b-xl h-16 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 text-md md:text-xs lg:text-sm transition-all duration-300 ease-in-out ${isOpen?"top-0 bottom-0 rounded-none flex-col py-10 bg-opacity-75 bg-neutral-900 w-screen h-screen justify-center":"top-0 justify-between "} `}>
        <Link 
        onClick={()=>setIsOpen(false)}
        href={"/"} 
        className=
        {
        " text-neutral-300 font-semibold"
          +" "+
        (isOpen?"text-4xl w-full text-center animate-[fadeanim_0.5s_ease]":"text-xl")
        }
        >
          Bis<span className="text-themeblue">Kit</span>
        </Link>

        <span className={`${isOpen?"flex flex-col flex-[0.65] text-xl h-auto animate-[fadeanim_1s_ease]":"hidden"} md:flex md:flex-row gap-2 md:gap-4 lg:gap-6 justify-start items-center font-normal md:flex-1 md:h-full md:pl-4`}>
            <Link className="hover:text-themeblue transition-colors h-full flex items-center whitespace-nowrap" href={"/"} onClick = {()=>setIsOpen(false)} >Home</Link>
            <Link className="hover:text-themeblue transition-colors h-full flex items-center whitespace-nowrap" href={"/about"} onClick = {()=>setIsOpen(false)} >About</Link>
            <Link className="hover:text-themeblue transition-colors h-full flex items-center whitespace-nowrap" href={"/games"} onClick = {()=>setIsOpen(false)} >Games</Link>
            <Link className="hover:text-themeblue transition-colors h-full flex items-center whitespace-nowrap" href={"/leaderboard"} onClick = {()=>setIsOpen(false)} >Leaderboard</Link>
            <Link className="hover:text-themeblue transition-colors h-full flex items-center whitespace-nowrap" href={"/team"} onClick = {()=>setIsOpen(false)} >Our Team</Link>
        </span>
        
        <span className={"md:flex" + " " + (isOpen?"flex animate-[fadeanim_1s_ease]":"hidden")}>

        {/* Box for showing login and signup links */}
        {
          user
          ?
          <UserProfileBox userFromProps={user} />
          :
          <LoginSignupBox onClick={()=>setIsOpen(false)}/>
        }
        </span>

        {/* the menu button for mobile devices */}

        <span 
        className=
        {
          "w-8 hover:bg-white cursor-pointer hover:bg-opacity-15 aspect-square hover:text-themeorange flex md:hidden p-1 transition-colors active:scale-90"
        + " " +
        (isOpen?"w-auto p-2 bg-neutral-700 rounded-full border-2 border-neutral-600 mt-5":"rounded-lg")
        }
        onClick = {toggleMenuOpen}
        >
          {
          isOpen
          ?
          <X className="w-full "/>
          :
          <Menu className="w-full" />
          }
        </span>        

    </nav>
    )
}

