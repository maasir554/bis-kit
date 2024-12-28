import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useState } from "react"

import { signOut } from "next-auth/react"

import { useSession } from "next-auth/react"

export const ProfileDelete = ({userId}:{userId:string}) => {
    
    const session = useSession()

    const [isDeleted, setIsDeleted] = useState(false);
    
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="mt-20 text-semibold text-red-500 px-4 py-2 rounded-xl bg-red-800/40">Delete account</button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-red-700">
          <AlertDialogHeader >
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-transparent border-none"
                onClick={()=>{
                    (async()=>{
                        try{
                            const response = await fetch(`/api/users/${userId}`,
                                {
                                    method: "DELETE",
                                    headers: {
                                        'Content-Type': 'application/json',
                                      },
                                }
                            );
                            if(response.ok){
                                console.log("user deleted sussessfully!");
                                setIsDeleted(true);
                                await session.update({
                                    name:"",id:"",image:"",email:""
                                })
                                await signOut({redirect:true, redirectTo:"/"})
                            }
                        }
                        catch(err){
                            console.error("error in deleting the user", err);
                        }
                    })()
                    

                }}
            >
            Delete account
            </AlertDialogAction>
            <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
        {
            isDeleted&&
                <div className="fixed top-0 left-0 w-screen h-screen bg-white flex flex-col justify-center items-center">
                        <h1 className="text-4xl text-black">
                            Your account has been deleted successfully.
                        </h1> 
                        <p className="text-black text-2xl">
                            {"It's great we had you! and hope you'd come again ;-)"}
                        </p>        
                </div>
        }
        
      </AlertDialog>
    )
  }

