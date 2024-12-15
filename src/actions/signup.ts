"use server"
import { hash } from "bcryptjs";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const createNewAccount = async (name:string,email:string,password:string) => {
     
      if(!name || !email || !password) throw new Error("Please provide all fields");
    
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
        //   throw new Error ("User already exist.");
          return new Error ("User already exist.");
      }
      
      const hashedPassword = await hash(password,10);
                        
      if(!user){ 
        
        try{
            const user = await prisma.user.create({
              data: {
                name: name,
                email:email,
                password:hashedPassword
              }}
            );
            console.log(user);
        }
        catch(error){
            console.log(error);
            return error;   
        }
    }
    
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
    
}
