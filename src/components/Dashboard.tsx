import { User } from "next-auth"

interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: User|null|undefined;
  }

export const DashBoard = ({user}:DashboardProps) => {
    return(<section id="dashboard" className="w-full min-h-dvh bg-neutral-800 flex flex-col justify-center items-center">
        <h1 className="text-neutral-100 text-3xl text-center font-semibold">
            Here is your Dashboard, <span className="text-themeorange">{user?.name}</span><br/>
            And your email is <span className="text-themeblue">{user?.email}</span>  btw.
        </h1>
    </section>
    )
}
