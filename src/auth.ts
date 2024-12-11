import NextAuth, { CredentialsSignin } from "next-auth"
import Google from "next-auth/providers/google" 
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
        name:"Credentials",
        credentials:{
            email:{
                label:"Email",
                type:"email",
            },
            password:{label:"Password",type:"password"},
        },
        authorize:async (credentials)=>{
            
            const email = credentials.email as string | undefined

            const password= credentials.password as string | undefined

            if (!email || !password ) 
                throw new CredentialsSignin("Please provide both email and password");

            if (typeof email !== "string") throw new CredentialsSignin({
                cause:"Email is invalid"
            });

            const user= {email,id:"dfglkd"};

            if(password !=="passcode") throw new CredentialsSignin({
                cause:"Password does not match"
            });
        
            else return user;
            }
    })
  ],
})
