import NextAuth, { CredentialsSignin } from "next-auth"
import Google from "next-auth/providers/google" 
import Credentials from "next-auth/providers/credentials"
// import { User } from "./models/userModel"

import { PrismaClient } from '@prisma/client'

import { compare } from "bcryptjs"
// import { connectToDatabase } from "./lib/utils"

const prisma = new PrismaClient();

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
            
            // await connectToDatabase(); // now, connect to the database

            // const user = await User.findOne({email}).select("+password");
            // NOTE: '+' is written to indicate that it is optional

            const user = await prisma.user.findUnique({
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

            if (!user) throw new CredentialsSignin("User does not exist");

            if (!user.password) throw new CredentialsSignin("Invalid Email or password");

            const isMatch = await compare(password, user.password)

            if (!isMatch) throw new CredentialsSignin("Email and password does not match.")
        
            else return {name:user.name, email: user.email, id: user.id};
            }
    }),
],
secret: process.env.AUTH_SECRET,
})
