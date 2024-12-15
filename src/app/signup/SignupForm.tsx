"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { createNewAccount } from "@/actions/signup";
import { toast } from "sonner";


export const SignupForm = () =>
{
return <form 
    action={
        async (formData:FormData)=>{
            const name  = formData.get("name") as string;
            const email = formData.get("email") as string ;
            const password = formData.get("password") as string ;
            
            if(name&&email&&password){

                const error = await createNewAccount(name,email,password) as Error;
                if(!error){toast.success("account created");
                redirect("/login");}
                else{
                    // console.log(error);
                    toast.error("account already exist.");
                }
        }
    
        }
    } 
    className="flex flex-col gap-4">
    <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Name" name="name" type="text" />
    <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Email" name="email" type="email" />
    <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Create Password" name="password" type="password" />
    <Button className=" text-white bg-gradient-to-r from-themeorange to-themeblue py-5 sm:py-7 rounded-full hover:from-themeblue hover:to-themeorange " type="submit">Create Account</Button>
</form>
}