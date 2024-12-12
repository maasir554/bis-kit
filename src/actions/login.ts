"use client"

import { signIn } from "next-auth/react";
import { CredentialsSignin } from "next-auth";


export const credentialsLogin = async (email:string, password:string) => {

    if (!email || !password) throw new Error ("Please provide the required credentials.");

    try{
        await signIn("credentials", {
            email,
            password,
            redirect:true,
            redirectTo: "/"
        });
    }
    catch(error){
        const err = error as CredentialsSignin;
        console.log(err.message);
        return error;
    }
    return false;
}
