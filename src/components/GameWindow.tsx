'use client';

import {useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
// import { User } from 'next-auth';

export const GameWindow = ({gamename}:{gamename:string}) => {
    
    const session = useSession()
    const userId = session.data?.user?.id;
    
    const [lastScore, setLastScore] = useState<number | null>(null)

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Only handle messages from our game
      if (event.data.type === 'SUBMIT_SCORE') {
        try {
          console.log('Received score:', event.data.score)
          setLastScore(event.data.score)
          
          const response = await fetch('/api/scores', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gamename: gamename,
              score: event.data.score,
              userId: userId 
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
  }, [gamename])

  return (
    <div className="relative h-screen w-full">
      {lastScore && (
        <div className="absolute top-0 right-0 p-4 bg-green-100">
          Last Score: {lastScore}
        </div>
      )}
      <iframe 
        src={`/api/games/${gamename}?file=index.html`}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}