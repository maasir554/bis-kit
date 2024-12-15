"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { credentialsLogin } from "@/actions/login"
import { toast } from "sonner"


export const LoginForm = () =>
    {
    return <form 
            className="flex flex-col gap-4"
            action={
                 async(formData:FormData)=>{

                    const email = formData.get("email") as string;
                    const password = formData.get("password") as string;
                    
                    const toastId = toast.loading("Logging in...")
                    
                    const error = await credentialsLogin(email, password);
                    
                    if(!error){
                        toast.success("Login Successful!",{id:toastId});
  
                        window.location.href = '/' 
                    }
                    
                    else {
                        toast.error("Invalid Credentials.", {id:toastId})
                    }
                }
            }
            >
            <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Enter your Email" name="email" type="email" />
            <Input className="bg-neutral-800 border-neutral-600 py-5 sm:py-7 rounded-full px-4 sm:px-7 text-xs sm:text-sm" placeholder="Enter Password" name="password" type="password" />
            <Button className="text-white bg-gradient-to-r from-themeorange to-themeblue py-5 sm:py-7 rounded-full hover:from-themeblue hover:to-themeorange active:scale-95 transition-all" type="submit">Login</Button>
            </form>
}