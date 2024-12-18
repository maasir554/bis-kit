'use client';

import {useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { useTotalPointsStore } from "@/app/stores/pointsStore";

// import { User } from 'next-auth';

export const GameWindow = ({gamename}:{gamename:string}) => {
    
    const [userId,setUserId] = useState("");

    const session = useSession();
    
    const [currentTotalScore, setCurrentTotalScore] = useState(0);
    
  const updatePointsInFrontend = useTotalPointsStore().updateTotalPoints

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

            const newCurrentTotalPoints = (currentTotalScore + Math.ceil((event.data.score)/(gamename==="manak-matchers"?40:20)))
            
            const response = await fetch(`/api/users/${userId}/points`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                gamename: gamename,
                currentlyEarnedPoints: event.data.score,
                newCurrentTotalPoints: newCurrentTotalPoints,
                // userId: userId 
              })
            })

              if (!response?.ok) {
              throw new Error('Failed to submit score')
              }

              updatePointsInFrontend(newCurrentTotalPoints);

              // send a confirmation back to the game
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
        
    }, [gamename, session, session?.status, currentTotalScore, userId])

      return (
      <div className="relative h-full w-[95%] overflow-hidden rounded-xl border-2 border-neutral-600">
        <iframe 
          src={gamename!== "a-gold-story"?`/api/games/${gamename}?file=index.html`:"/a-gold-story/index.html"}

            className= "w-full h-full border-none"

          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    )
}