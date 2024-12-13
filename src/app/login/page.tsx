"use client"

import {
    Card,
    CardContent,
    // CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button"
import Link from "next/link";

import { loginHandler } from "./loginHandler";


const Page = () => {

    

    return(
        <div className="flex justify-center items-center w-full h-dvh bg-neutral-900 p-2 md:p-5">
            <Card className="bg-neutral-800 border-neutral-900 text-white w-full max-w-xl py-6 px-2 sm:px-5 rounded-2xl">
                <CardHeader>
                    <CardTitle className="w-full text-center text-2xl sm:text:3xl md:text-4xl mb-2 sm:mb-5">Login to BisKit</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <form 
                        action={loginHandler}
                        className="flex flex-col gap-4">
                        <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Enter your Email" name="email" type="email" />
                        <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Enter Password" name="password" type="password" />
                        <Button className="text-white bg-gradient-to-r from-themeorange to-themeblue py-5 sm:py-7 rounded-full hover:from-themeblue hover:to-themeorange" type="submit">Login</Button>
                    </form>
                    
                </CardContent>
                <CardFooter className="flex flex-col w-full gap-4"> 
                    <p className="w-full text-center">or</p>
                    <form action="" className="w-full">
                        <Button type="submit" variant={"outline"} className="text-neutral-900 py-5 sm:py-7 rounded-full w-full">
                            Login with Google
                        </Button>
                    </form>
 
                    <Link className="text-neutral-300 text-sm mt-6 hover:underline" href={"/signup"}> Don&apos;t Have an account? <span className="text-themeblue">Signup</span></Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page
