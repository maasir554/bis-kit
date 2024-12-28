import NextAuth, {CredentialsSignin} from "next-auth"
import Google from "next-auth/providers/google" 
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from '@prisma/client'

import { compare } from "bcryptjs"

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

            const user = await prisma.user.findUnique({
                where: {
                  email: email
                },
                select: {
                  id: true,
                  email: true,
                  name: true,
                  profilepiclink:true,
                  password: true  // Including password field explicitly
                }
              });

            if (!user) throw new CredentialsSignin("User does not exist");

            if (!user.password) throw new CredentialsSignin("Invalid Email or password", {code:"404"});

            const isMatch = await compare(password, user.password)

            if (!isMatch) throw new CredentialsSignin("Email and password does not match.")
        
            else return {name:user.name, email: user.email, id: user.id, image: user.profilepiclink};
            }
    }),
],

pages:{
  signIn: "/login",
},

secret: process.env.AUTH_SECRET,

callbacks: {
  async signIn({ user, account,}) {
    if (account?.provider === "google" && user.email && user.name) {
      try {
       const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
      
        if(existingUser){
          await prisma.user.update({
            where:{
              id:existingUser.id
            },
            data:{
              profilepiclink:user.image
            }
          })
        }
        
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              profilepiclink:user.image
              
            }
          })
        }


        return true
      } catch (error) {
        console.error("Error saving user:", error)
        return false
      }
    }
    return true
  },
  async jwt({token, user, account, profile,trigger, session}){
    
    if(account?.provider === "google"){
      const userFromDb = await prisma.user.findUnique({
        where: { email: profile?.email as string },
      });

      token.userId = userFromDb?.id;
      token.profilepic = user.image;
      if(!!userFromDb?.name && userFromDb?.name !== ""){
        token.name = userFromDb.name
      }
      return token;
    }
    
    if (trigger === "update" && session?.name) {
      // Note, that `session` can be any arbitrary object, remember to validate it!
      token.name = session.name
    }

    if(user) {
      token.name = user.name
      token.userId = user.id || profile?.id
      token.profilepic= user.image || profile?.profilepiclink;
      }
      return token;
    },

    async session({session,token}){
      const id = token.userId as string;
      const image = token.profilepic as string;
      const name= token.name as string;
      
      session.user.id = id;
      session.user.image = image;
      session.user.name = name;

      return session
    },
  },

})
