"use client"

import { User } from "next-auth"

interface DashboardProps extends React.HTMLAttributes<HTMLDivElement> {
    user: User|null|undefined;
  }

export const DashBoard = ({user}:DashboardProps) => {
    return(<section id="dashboard" className="w-full min-h-dvh bg-neutral-800 flex flex-col justify-start items-start px-6 sm:px-16 md:px-24 lg:px-28 xl:px-32">
        <h1 className="text-neutral-100 text-xl sm:text-2xl md:text-3xl font-semibold mt-24 mb-1">
            Hello, <span className="text-themeorange">{user?.name}</span><br/>
        </h1>
        <p className=" text-xs sm:text-ms md:text-md text-neutral-200">
            Welcome to the dashboard!
        </p>
    </section>
    )
}
