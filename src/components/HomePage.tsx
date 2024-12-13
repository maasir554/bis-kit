
export const HomePage = () => (
<section id="Home" className="w-full min-h-screen flex flex-col justify-center items-center gap-10">
    <h1 className="text-5xl font-semibold -translate-y-1/2 text-center">
        Learn Indian Standards
            <br/>Through Gaming
    </h1>
    <p className="text-lg font-normal text-center max-w-4xl -translate-y-1/2">
        This will be the home page of the website and can be seen when user is on &quot;/&quot; endpoint while NOT logged in.
        and also on &quot;/Home&quot; endpoint even if the user is logged in
    </p>
</section>
)
