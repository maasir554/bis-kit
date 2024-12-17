
export default function page({params}:any){
    return  <section className="w-full min-h-dvh flex flex-col items-center justify-center">
                hello, this is the profile page for:<br/>
                {params.id}
            </section>
}
