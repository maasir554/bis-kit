import { hash } from "bcryptjs";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button"
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/auth"; //server version of signIn


const Page = () => {
    
    return(
        <div className="flex justify-center items-center w-full h-dvh p-5">
            <Card className="bg-neutral-800 border-none text-white max-w-xl w-full py-6 px-2 sm:px-5 rounded-2xl">
                <CardHeader>
                    <CardTitle className="w-full text-center text-2xl sm:text:3xl md:text-4xl mb-2 sm:mb-5">Create an account</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <form 
                        action={
                            async (formData:FormData)=>{
                                "use server";
                                const name  = formData.get("name") as string | undefined;
                                const email = formData.get("email") as string | undefined;
                                const password = formData.get("password") as string | undefined;
                                if(!name || !email || !password) throw new Error("Please provide all fields");
                                
                                // connectToDatabase() //estabilish connection with the database
                        
                                // const user = await User.findOne({email}) // to check if the user already exist.
                                const user= await prisma.user.findUnique({
                                    where: {
                                      email: email
                                    },
                                    select: {
                                      id: true,
                                      email: true,
                                      name: true,
                                      password: true  // Including password field explicitly
                                    }
                                  });
                        
                                if (user && user.password){ 
                                    console.log(user);
                                    throw new Error ("User already exist.");
                                }
                                
                                const hashedPassword = await hash(password,10);
                    
                                if(!user) await prisma.user.create({
                                    data: {
                                      name: name,
                                      email:email,
                                      password:hashedPassword
                                    },
                                  });

                                // If user already exist on db but does not have a password
                                // that means they have previously signed in with Google
                                // and now also want to setup credintials login as well
                                // and they want to update their username,
                                // then the following logic will handel  
                                if(user && !user.password) {
                                    await prisma.user.update(
                                        {
                                            where: {
                                                email: email,
                                            },
                                            data:{
                                                name: name,
                                                password: hashedPassword, 
                                            },
                                        },
                                    )

                                }

                                redirect("/login");
                        
                            }
                        } 
                        className="flex flex-col gap-4">
                        <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Name" name="name" type="text" />
                        <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Email" name="email" type="email" />
                        <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Create Password" name="password" type="password" />
                        <Button className=" text-white bg-gradient-to-r from-themeorange to-themeblue py-5 sm:py-7 rounded-full hover:from-themeblue hover:to-themeorange " type="submit">Create Account</Button>
                    </form>
                    
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
