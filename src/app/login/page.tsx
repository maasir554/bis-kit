"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button"
import Link from "next/link";
import { credentialsLogin } from "@/actions/login";
import { toast } from "sonner";


const Page = () => {

    

    return(
        <div className="flex justify-center items-center w-full h-dvh bg-neutral-900 p-2 md:p-5">
            <Card className="bg-neutral-800 border-neutral-900 text-white w-full max-w-xl py-6">
                <CardHeader>
                    <CardTitle>Login to BisKit</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <form 
                        action={async (formData:FormData) =>
                            {
                                const email = formData.get("email") as string;
                                const password = formData.get("password") as string;

                                if(!email || !password) toast.error("Please provide both credentials");
                                else{
                                    const toastId = toast.loading("Logging in...");
                                    const error = await credentialsLogin(email,password);
                                    if(!error){
                                        toast.success("Login Successful",{id:toastId});
                                    }
                                    else{
                                        toast.error("Error: "+error,{id:toastId})
                                    }
                                }
                            }
                        }
                        className="flex flex-col gap-4">
                        <Input className="bg-neutral-800 text-sm" placeholder="Enter your Email" name="email" type="email" />
                        <Input className="bg-neutral-800 text-sm" placeholder="Enter Password" name="password" type="password" />
                        <Button className="bg-neutral-200 text-neutral-900 hover:bg-neutral-100 hover:text-themeblue" type="submit">Login</Button>
                    </form>
                    
                </CardContent>
                <CardFooter className="flex flex-col w-full gap-4"> 
                    <p className="w-full text-center">or</p>
                    <form action="">
                        <Button type="submit" variant={"outline"} className="bg-neutral-700 text-white">
                            Login with Google
                        </Button>
                    </form>
 
                    <Link className="text-themeblue text-sm mt-6 hover:underline" href={"/signup"}> Don't Have an account? Signup</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page
