import { DashBoard } from "@/components/Dashboard"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
const Page = async () => {

    const session = await auth();

    return(
    <>
        {
            session
            ?
            <DashBoard user={session?.user} />
            :
            redirect("/login")
        }
    </>
            
    )
}

export default Page
