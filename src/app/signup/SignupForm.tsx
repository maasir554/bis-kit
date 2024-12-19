"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createNewAccount } from "@/actions/signup";
import { toast } from "sonner";
import { ChangeEvent, useState } from "react";
import { credentialsLogin } from "@/actions/login";

export const SignupForm = () =>
{
    const [formData, setFormData] = useState({
        name:"", email:"", password:""
      });    

    const handleChange = (evt:ChangeEvent<HTMLInputElement>
    )=>{
        const {name,value} = evt.target 
        setFormData(prevData=> ({...prevData,[name]:value}))
    }
return <form 
    action={
        async (formData:FormData)=>{
            const toastId = toast.loading("creating account...");
            const name  = formData.get("name") as string;
            const email = formData.get("email") as string ;
            const password = formData.get("password") as string ;
            
            if(name&&email&&password){
                const error = await createNewAccount(name,email,password) as Error;
                if(!error){toast.success("account created",{id:toastId});
                await credentialsLogin(email,password);
                // redirect("/");
                window.location.href = '/' 
            }
                else{
                    // console.log(error);
                    toast.error("account already exist.", {id:toastId});
                }
            }
            else{
                toast.error("fill all the credentials.",{id:toastId})
            }
    
        }
    } 
    className="flex flex-col gap-4">
    <Input onChange={handleChange} required value={formData.name} className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Name" name="name" type="text" />
    <Input onChange={handleChange} required value={formData.email} className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Email" name="email" type="email" />
    <Input onChange={handleChange} required value={formData.password} className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Create Password" name="password" type="password" />
    <Button disabled={!(formData.email&&formData.name&&formData.password)} className=" text-white bg-gradient-to-r from-themeorange to-themeblue py-5 sm:py-7 rounded-full hover:from-themeblue hover:to-themeorange active:scale-95 disabled:cursor-not-allowed" type="submit">Create Account</Button>
</form>
}