import { auth } from "@/auth"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



const LoginSignupBox = () => (
  <span className="flex flex-row gap-2 items-center justify-center font-normal">
  <Link href="/signup" className="hover:underline px-4 py-2 rounded-full bg-transparent active:scale-95">
    Signup
  </Link>

  <Link href="/login" className="hover:underline px-10 py-2 rounded-full bg-gradient-to-r from-themeblue to-themeorange hover:from-themeorange hover:bg-themeblue bg-opacity-75 active:scale-95">
    Login
  </Link>
</span>
);

const UserProfileBox = async () => {
  const user = (await auth())?.user;

  return (
      // <>
      //   <p>{user?.name}</p>
      //   <Avatar>
      //   <AvatarImage src="https://github.com/shadcn.png" />
      //   <AvatarFallback>USER</AvatarFallback>
      //   </Avatar>
      // </>
      <DropdownMenu>
        <DropdownMenuTrigger>
        <Avatar>
           <AvatarImage src="https://github.com/shadcn.png" />
           <AvatarFallback>USER</AvatarFallback>
           </Avatar>
        </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 text-white">
          <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem className="text-red-400 hover:text-red-900 hover:bg-black">
              Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export const NavBar = async () => {

  const session = await auth();

  const user = session?.user

  return(
        <nav className="fixed top-0 left-1/2 -translate-x-1/2 bg-opacity-10 bg-neutral-100 flex flex-row justify-between items-center gap-10 w-11/12 md:w-10/12 rounded-b-xl h-16 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        <span className="text-xl text-neutral-300 font-semibold">
          Bis<span className="text-themeblue">Kit</span>
        </span>

        <span className="flex flex-row gap-6 justify-start items-center font-normal text-sm flex-1 h-full">
            <Link className="hover:text-themeblue transition-colors h-full flex items-center" href={"/"} >Home</Link>
            <Link className="hover:text-themeblue transition-colors h-full flex items-center" href={"/about"} >About</Link>
            <Link className="hover:text-themeblue transition-colors h-full flex items-center" href={"/games"} >Games</Link>
            <Link className="hover:text-themeblue transition-colors h-full flex items-center" href={"/leaderboard"} >Leaderboard</Link>
            <Link className="hover:text-themeblue transition-colors h-full flex items-center" href={"/team"} >Our Team</Link>
        </span>

        {
          user
          ?
          <UserProfileBox/>
          :
          <LoginSignupBox/>
        }

    </nav>
    )
}
