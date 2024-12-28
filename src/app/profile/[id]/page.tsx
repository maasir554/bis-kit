
import { auth } from "@/auth"
import { getUserById } from "@/lib/utils";

import { ProfileCard } from "./ProfileCard";

export default async function page({params}:{params:Promise<{id:string}>}){


    const session = await auth()

    const {id} = await params

    // const clientUser = session?.user;

    const profileUser = await getUserById(id);

    const isOwnProfile = session?.user?.id === id;

    return <ProfileCard id={id} profileUser={profileUser} isOwnProfile={isOwnProfile} />
}
