
// import { useSession } from "next-auth/react"

export default async function page({params}:{params:Promise<{id:string}>}){

    // const session = useSession()

    const {id} = await params

    return  <section className="w-full min-h-dvh flex flex-col items-center justify-center">
                hello, this is the profile page for:<br/>
                {id}
            </section>
}
