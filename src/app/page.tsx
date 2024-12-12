
import { NavBar } from "@/components/NavBar";
import { HomePage } from "@/components/HomePage";
import { DashBoard } from "@/components/Dashboard";

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  // console.log(user);

  const isUserLoggedIn = user;

  return (
      <>  
        {
        isUserLoggedIn
          ?
          <DashBoard user={user} /> 
          :
          <HomePage/>
        }
      </>
  );
}
