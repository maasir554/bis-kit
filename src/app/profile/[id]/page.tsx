
import { redirect } from 'next/navigation'

import { updateUserSocialMediaLink } from "@/actions/socialMedia";

import { auth } from "@/auth"
import { getUserById } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export default async function page({params}:{params:Promise<{id:string}>}){

    const getLeagueColor = (userPoints:number) => userPoints>50 ? "yellow-500" : userPoints>25? "zinc-400" : "yellow-900";

    const session = await auth()

    const {id} = await params

    // const clientUser = session?.user;

    const profileUser = await getUserById(id);
    

    const isOwnProfile = session?.user?.id === id;

    const linkdeInAction = async(FormData:FormData)=>{
        'use server'
        await updateUserSocialMediaLink(id, "linkedin", FormData.get("profileLink") as string)
        redirect("/profile/"+id)
    }
    const XAction = async(FormData:FormData)=>{
        'use server'
        await updateUserSocialMediaLink(id, "twitter", FormData.get("profileLink") as string)
        redirect("/profile/"+id)
    }
    const InstagramAction = async(FormData:FormData)=>{
        'use server'
        await updateUserSocialMediaLink(id, "instagram", FormData.get("profileLink") as string)
        redirect("/profile/"+id)
    }

    return  <section className="w-full min-h-dvh flex flex-col items-center justify-center px-4">
                {/* hello, this is the profile page for:<br/>
                {id} */}
                <h1 className="mb-20 text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-400 font-semibold text-center">
                    {profileUser?.name}
                </h1>

                <div className="flex flex-row gap-6 justify-center items-center flex-wrap">
                    <Image className={` w-[50vw] max-w-[175px] rounded-full p-[1px] border-8 border-${getLeagueColor(profileUser?.currentTotalPoints||0)}`} src={profileUser?.profilepiclink || "https://github.com/shadcn.png"} width={100} height={100} alt="avatar" />
                    <div className="flex flex-col gap-4 flex-nowrap flex-1">
                        <div className="flex flex-row flex-nowrap gap-3 items-center justify-center">
                            <span className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-yellow-500 to-yellow-700 "></span>
                            <span className="text-xl font-semibold">{profileUser?.currentTotalPoints} points</span>
                        </div>

                        {!!profileUser?.socialLinks?.linkedin?
                        <div className="flex flex-row gap-4 items-center justify-center">
                            <Link target="_" href={profileUser?.socialLinks?.linkedin} className="flex flex-row flex-nowrap gap-3 items-center hover:text-sky-600 transition pl-4">
                                <span className="text-lg font-semibold">Linkedin </span>
                                {/* <span className="text-xl font-semibold">{profileUser?.currentTotalPoints}</span> */}
                                <SquareArrowOutUpRight />
                            </Link>
                            {
                                !!isOwnProfile&&
                                <Popover>
                                <PopoverTrigger className="text-xs font-semibold bg-neutral-800 px-4 py-1 rounded-full active:scale-95 hover:bg-neutral-600 whitespace-nowrap flex items-center">Edit</PopoverTrigger>
                                <PopoverContent className="bg-neutral-900 text-white border-2  border-neutral-500">
                                    <form action={linkdeInAction}>
                                        <Input className="bg-transparent" name="profileLink" placeholder="Enter your Linkedin profile link" />
                                        <button className="w-full p-2 mt-2 rounded-lg font-semibold bg-neutral-200 hover:bg-neutral-50 text-black" type="submit">submit</button>
                                    </form>
                                </PopoverContent>
                            </Popover>
                            }
                        </div>
                        :
                        isOwnProfile?
                        <Popover>
                            <PopoverTrigger className="w-full text-base font-semibold bg-neutral-800 px-4 py-2 rounded-full active:scale-95 hover:bg-neutral-600 whitespace-nowrap">Add Linkedin</PopoverTrigger>
                            <PopoverContent className="bg-neutral-900 text-white border-2  border-neutral-500">
                                <form action={linkdeInAction}>
                                    <Input className="bg-transparent" name="profileLink" placeholder="Enter your Linkedin profile link" />
                                    <button className="w-full p-2 mt-2 rounded-lg font-semibold bg-neutral-200 hover:bg-neutral-50 text-black" type="submit">submit</button>
                                </form>
                            </PopoverContent>
                        </Popover>
                        :
                        (<>Linkedin link not provided</>)
                        }
                        
                        {!!profileUser?.socialLinks?.twitter?
                        <div className="flex flex-row gap-4 items-center justify-center">
                            <Link target="_" href={profileUser?.socialLinks?.twitter} className="flex flex-row flex-nowrap gap-3 items-center hover:text-sky-600 transition pl-4">
                                <span className="text-lg font-semibold">{"X(Twitter)"}</span>
                                {/* <span className="text-xl font-semibold">{profileUser?.currentTotalPoints}</span> */}
                                <SquareArrowOutUpRight />
                            </Link>
                            {
                                !!isOwnProfile&&
                                <Popover>
                                <PopoverTrigger className="text-xs font-semibold bg-neutral-800 px-4 py-1 rounded-full active:scale-95 hover:bg-neutral-600 whitespace-nowrap flex items-center">Edit</PopoverTrigger>
                                <PopoverContent className="bg-neutral-900 text-white border-2  border-neutral-500">
                                    <form action={XAction}>
                                        <Input className="bg-transparent" name="profileLink" placeholder="Enter your X(Twitter) profile link" />
                                        <button className="w-full p-2 mt-2 rounded-lg font-semibold bg-neutral-200 hover:bg-neutral-50 text-black" type="submit">submit</button>
                                    </form>
                                </PopoverContent>
                            </Popover>
                            }
                        </div>
                        :
                        isOwnProfile?
                        <Popover>
                          <PopoverTrigger className="w-full text-base font-semibold bg-neutral-800 px-4 py-2 rounded-full active:scale-95 hover:bg-neutral-600 whitespace-nowrap">Add X account</PopoverTrigger>
                          <PopoverContent className="bg-neutral-900 text-white border-2  border-neutral-500">
                                <form action={XAction}>
                                    <Input className="bg-transparent" name="profileLink" placeholder="Enter your X(Twitter) profile link" />
                                    <button className="w-full p-2 mt-2 rounded-lg font-semibold bg-neutral-200 hover:bg-neutral-50 text-black" type="submit">submit</button>
                                </form>  
                          </PopoverContent>
                        </Popover>
                        :
                        <>X(Twitter) link not provided</>
                        }
                        
                        {!!profileUser?.socialLinks?.instagram?
                        <div className="flex flex-row gap-4 items-center justify-center">    
                            <Link target="_" href={profileUser?.socialLinks?.instagram} className="flex flex-row flex-nowrap gap-3 items-center hover:text-sky-600 transition pl-4">
                                <span className="text-lg font-semibold">Instagram </span>
                                {/* <span className="text-xl font-semibold">{profileUser?.currentTotalPoints}</span> */}
                                <SquareArrowOutUpRight />
                            </Link>
                            {
                                !!isOwnProfile&&
                                <Popover>
                                <PopoverTrigger className="text-xs font-semibold bg-neutral-800 px-4 py-1 rounded-full active:scale-95 hover:bg-neutral-600 whitespace-nowrap flex items-center">Edit</PopoverTrigger>
                                <PopoverContent className="bg-neutral-900 text-white border-2  border-neutral-500">
                                    <form action={InstagramAction}>
                                        <Input className="bg-transparent" name="profileLink" placeholder="Enter your Instagram profile link" />
                                        <button className="w-full p-2 mt-2 rounded-lg font-semibold bg-neutral-200 hover:bg-neutral-50 text-black" type="submit">submit</button>
                                    </form>
                                </PopoverContent>
                            </Popover>
                            }
                        </div>
                        :
                        isOwnProfile?
                        <Popover>
                          <PopoverTrigger className="w-full text-base font-semibold bg-neutral-800 px-4 py-2 rounded-full active:scale-95 hover:bg-neutral-600 whitespace-nowrap">Add Instagram</PopoverTrigger>
                          <PopoverContent className="bg-neutral-900 text-white border-2  border-neutral-500">
                                <form action={InstagramAction}>
                                    <Input className="bg-transparent" name="profileLink" placeholder="Enter your Instagram profile link" />
                                    <button className="w-full p-2 mt-2 rounded-lg font-semibold bg-neutral-200 hover:bg-neutral-50 text-black" type="submit">submit</button>
                                </form>  
                          </PopoverContent>
                        </Popover>
                        :
                        <>instagram link not provided</>
                        }
                    </div>
                </div>
            </section>
}
