
import { auth } from "@/auth"
import { getUserById } from "@/lib/utils";

import { ProfileCard } from "./ProfileCard";

export default async function page({params}:{params:Promise<{id:string}>}){


    const session = await auth()

    const {id} = await params

    // const clientUser = session?.user;

    try{
        const profileUser = await getUserById(id);
        const isOwnProfile = session?.user?.id === id;
        return<>
                {
                    !!profileUser?
                    <ProfileCard id={id} profileUser={profileUser} isOwnProfile={isOwnProfile} />
                    :
                <div className="w-full h-screen text-4xl text-themeorange flex justify-center items-center">
                    {"4O4 - User not found ;-("}
                </div>
                }
            </> 
    }catch(error){
        return<div className="w-full h-screen text-4xl text-themeorange flex justify-center items-center">
        {"404 - User not found ;-("}
    </div>
    }
    

}
