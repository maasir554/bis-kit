import { hash } from "bcryptjs";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

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

// import { User } from "@/models/userModel";
import { redirect } from "next/navigation";
// import { connectToDatabase } from "@/lib/utils";



const Page = () => {
    
    // const formSubmitHandeler = async (formData:FormData)=>{
    //     "use server";
    //     const name  = formData.get("name") as string | undefined;
    //     const email = formData.get("email") as string | undefined;
    //     const password = formData.get("password") as string | undefined;
    //     if(!name || !email || !password) throw new Error("Please provide all fields");
        
    //     // connectToDatabase() //estabilish connection with the database

    //     // const user = await User.findOne({email}) // to check if the user already exist.
    //     const user= await prisma.user.findUnique({
    //         where: {
    //           email: email
    //         },
    //         select: {
    //           id: true,
    //           email: true,
    //           name: true,
    //           password: true  // Including password field explicitly
    //         }
    //       });

    //     if (user){ 
    //         console.log(user);
    //         throw new Error ("User already exist.");
    //     }
        
    //     const hashedPassword = await hash(password,10);

    //     //create new user

    //     // User.create({
    //     //     name:name,
    //     //     email:email,
    //     //     password:hashedPassword
    //     // });
    //     const newUser = await prisma.user.create({
    //         data: {
    //           name: name,
    //           email:email,
    //           password:hashedPassword
    //         },
    //       })
        
    //     redirect("/login")

    // }
    
    return(
        <div className="flex justify-center items-center w-full h-dvh">
            <Card className="bg-neutral-900 text-white max-w-xl w-full border-neutral-600">
                <CardHeader>
                    <CardTitle>Signup</CardTitle>
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
                        
                                if (user){ 
                                    console.log(user);
                                    throw new Error ("User already exist.");
                                }
                                
                                const hashedPassword = await hash(password,10);
                        
                                //create new user
                        
                                // User.create({
                                //     name:name,
                                //     email:email,
                                //     password:hashedPassword
                                // });
                                await prisma.user.create({
                                    data: {
                                      name: name,
                                      email:email,
                                      password:hashedPassword
                                    },
                                  });
                                
                                redirect("/login");
                        
                            }
                        } 
                        className="flex flex-col gap-4">
                        <Input className="bg-neutral-800 border-neutral-600" placeholder="Enter your Name" name="name" type="text" />
                        <Input className="bg-neutral-800 border-neutral-600" placeholder="Enter your Email" name="email" type="email" />
                        <Input className="bg-neutral-800 border-neutral-600" placeholder="Create Password" name="password" type="password" />
                        <Button className="bg-neutral-700 text-white hover:text-black hover:bg-white" type="submit">Create Account</Button>
                    </form>
                    
                </CardContent>
                <CardFooter className="flex flex-col w-full gap-4"> 
                    <p className="w-full text-center">or</p>
                    <form action="">
                        <Button className="bg-neutral-800 text-neutral-200" type="submit" variant={"outline"}>
                            Sign up with Google
                        </Button>
                    </form>

                    <Link className="text-sm text-themeblue hover:underline mt-8" href={"/login"}> Already have an account? login</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page
