'use client';

import {useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { useTotalPointsStore } from "@/app/stores/pointsStore";

// import { User } from 'next-auth';

export const GameWindow = ({gamename}:{gamename:string}) => {
    
    const [userId,setUserId] = useState("");

    const session = useSession();
    
    const frontendPointsStore = useTotalPointsStore()
    
    const totalPoints = frontendPointsStore.totalPoints

    const updatePointsInFrontend = frontendPointsStore.updateTotalPoints


    useEffect(()=>{
      if(session.status==='authenticated' && session?.data?.user?.id){
        setUserId(session.data.user.id)
      }
    },[session]);


    useEffect(()=>{
      if (!userId) return;
      (async()=>{
          try{
            await frontendPointsStore.fetchTotalPoints(userId);
            console.log(totalPoints);
          }
          catch(err){
            console.error("Error in getting total points from server",err);
          }
      })()
    },[])


    useEffect(() => {
      
      if(!userId) return;

      if(session.status === "loading") return;
      if(session.status === "unauthenticated") console.error("Unauthenticated request.");

      console.log(session);
      console.log("userId is: ",userId);
      
      const handleMessage = async (event: MessageEvent) => {
        // Only handle messages from our game
        if (event.data.type === 'SUBMIT_SCORE') {
          try {
            console.log('Received score:', event.data.score);

            const newCurrentTotalPoints = (totalPoints + Math.ceil((event.data.score)/(gamename==="manak-matchers"?20:40)))

            const response = await fetch(`/api/users/${userId}/points`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                gamename: gamename,
                currentlyEarnedPoints: event.data.score,
                newCurrentTotalPoints: newCurrentTotalPoints,
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
        
    }, [gamename,frontendPointsStore, userId])

      return (
      <div className="relative h-full w-[95%] overflow-hidden rounded-xl">
        <iframe 
          src={gamename!== "a-gold-story"?`/api/games/${gamename}?file=index.html`:"/a-gold-story/index.html"}

            className= "w-full h-full border-none"

          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    )
}