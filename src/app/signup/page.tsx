import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

import { Button } from "@/components/ui/button"
import Link from "next/link";
import { signIn } from "@/auth"; //server version of signIn
import { SignupForm } from "./SignupForm";


const Page = () => {
    
    return(
        <div className="flex justify-center items-center w-full h-dvh p-5">
            <Card className="bg-neutral-800 border-none text-white max-w-xl w-full py-6 px-2 sm:px-5 rounded-2xl">
                <CardHeader>
                    <CardTitle className="w-full text-center text-2xl sm:text:3xl md:text-4xl mb-2 sm:mb-5">Create an account</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <SignupForm/>
                </CardContent>
                <CardFooter className="flex flex-col w-full gap-4"> 
                    <p className="w-full text-center">or</p>
                    <form action={
                        async () => {
                            "use server";
                            await signIn("google", {redirect:true,redirectTo:"/"});
                        }
                    } className="w-full">
                        <Button className="text-neutral-900 py-5 sm:py-7 rounded-full w-full " type="submit" variant={"outline"}>
                            Sign up with Google
                        </Button>
                    </form>

                    <Link className="text-sm text-neutral-300 hover:underline mt-8" href={"/login"}> Already have an account? <span className="text-themeblue">login</span></Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page
