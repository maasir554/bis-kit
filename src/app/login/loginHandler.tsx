// "use server";

import { toast } from "sonner";
import { credentialsLogin } from "@/actions/login";

export const loginHandler = async (formData:FormData) =>
    {
        // "use server";
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
