'use client';

import {useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
// import { User } from 'next-auth';

export const GameWindow = ({gamename}:{gamename:string}) => {
    
    const [userId,setUserId] = useState("");

    const session = useSession();
    
    const [currentTotalScore, setCurrentTotalScore] = useState(0);
    
    useEffect(() => {
      
      if(session.status === "loading") return;
      if(session.status === "unauthenticated") console.error("Unauthenticated request.");

      console.log(session);
      setUserId(session?.data?.user?.id || 'hello');
      console.log("userId is: ",userId);

      if(userId) (async()=>{
        // first fetch the user's currentTotalScore
        try{

          const responseOfGetTotalPoints = await fetch(`/api/users/${userId}/points`);

          if(!responseOfGetTotalPoints.ok) throw new Error ("Failed to get total points");

          const dataOfGetTotalPoints = await responseOfGetTotalPoints.json();
          
          console.log("total points from database ",dataOfGetTotalPoints);

          const {totalPoints} = dataOfGetTotalPoints
          
          console.log(totalPoints);

          setCurrentTotalScore(Number(totalPoints));

          console.log(currentTotalScore);
        }
        catch(error){
          console.error("Error in getting total current points of the user", error);
        }

      })();
      
      const handleMessage = async (event: MessageEvent) => {
        // Only handle messages from our game
        if (event.data.type === 'SUBMIT_SCORE') {
          try {
            console.log('Received score:', event.data.score);

            const response = await fetch(`/api/users/${userId}/points`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                gamename: gamename,
                currentlyEarnedPoints: event.data.score,
                newCurrentTotalPoints: (currentTotalScore + Math.ceil((event.data.score)/(gamename==="manak-matchers"?40:20))),
                // userId: userId 
              })
            })

              if (!response.ok) {
              throw new Error('Failed to submit score')
            }

              // Optionally send a confirmation back to the game
            const iframe = document.querySelector('iframe')
            iframe?.contentWindow?.postMessage({
              type: 'SCORE_SAVED',
              success: true
            }, '*')

            } catch (error) {
            console.error('Error saving score:', error)
          }
        }
      }

        window.addEventListener('message', handleMessage)

        return () => window.removeEventListener('message', handleMessage)
        
    }, [gamename, session, session?.status, currentTotalScore])

      return (
      <div className="relative h-full w-[95%] overflow-hidden rounded-xl">
        <iframe 
          src={`/api/games/${gamename}?file=index.html`}

            className= "w-full h-full border-none"

          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    )
}