"use client";

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

import { signOut } from "next-auth/react";

import { MouseEventHandler, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  // const user = (await auth())?.user;
  
  //client method to fetch user data
  // const {data:session} = useSession()
  // const user = session?.user;

  const user = userFromProps;

  return (
      <DropdownMenu>
        <DropdownMenuTrigger>
        <Avatar className="w-20 h-20 md:w-10 md:h-10" >
           <AvatarImage src="https://github.com/shadcn.png" />
           <AvatarFallback>{user?.name}</AvatarFallback>
           </Avatar>
        </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 text-white border-neutral-600 px-5 py-5">
          <DropdownMenuLabel className="flex flex-col gap-2">
            <h1 className="text-xl">
              {user?.name}
            </h1> 
            <p className="text-sm font-normal text-neutral-400">
              {user?.email}
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

  const user = userFromProps

  // state of navbar [mobile devices]

  const [isOpen, setIsOpen] = useState<Boolean>(false)

  const toggleMenuOpen = () => setIsOpen(isOpen => !isOpen);

  useEffect(()=>{
    window.addEventListener("resize", ()=> {
      if(window.innerWidth>=768) setIsOpen(false);
    })
  },[])

  return(
        <nav className={`overflow-hidden z-50 backdrop-blur-lg fixed left-1/2 -translate-x-1/2 bg-opacity-10 bg-neutral-200 flex flex-row items-center gap-4 lg:gap-6 xl:gap-10 w-11/12 md:w-10/12 rounded-b-xl h-16 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 text-md md:text-xs lg:text-sm transition-all duration-300 ease-in-out ${isOpen?"top-0 bottom-0 rounded-none flex-col py-10 bg-opacity-75 bg-neutral-900 w-screen h-screen justify-center":"top-0 justify-between "} `}>
        <Link href={"/"} 
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
        (isOpen?"w-auto p-4 bg-themeblue rounded-full":"rounded-lg")
        }
        onClick = {toggleMenuOpen}
        >
          {
          isOpen
          ?
          <X className="w-full"/>
          :
          <Menu className="w-full" />
          }
        </span>        

    </nav>
    )
}

