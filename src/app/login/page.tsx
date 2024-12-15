"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,

  } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
// because we want to work with client dynamically programmed components like toasts.

const Page = () => {


    return(
        <div className="flex justify-center items-center w-full h-dvh bg-neutral-900 p-2 md:p-5">
            <Card className="bg-neutral-800 border-neutral-900 text-white w-full max-w-xl py-6 px-2 sm:px-5 rounded-2xl">
                <CardHeader>
                    <CardTitle className="w-full text-center text-2xl sm:text:3xl md:text-4xl mb-2 sm:mb-5">Login to BisKit</CardTitle>
                    
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <LoginForm />
                </CardContent>
                <CardFooter className="flex flex-col w-full gap-4"> 
                    <p className="w-full text-center">or</p>
                    <form action={    
                                    async () => {
                                        await signIn("google", {redirect:true,redirectTo:"/"});
                                    }
                                } className="w-full">
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
