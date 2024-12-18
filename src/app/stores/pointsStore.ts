'use client'
import { create } from 'zustand'

interface ScoreState {
  totalPoints: number
  isLoading: boolean
  fetchTotalPoints: (userId:string) => Promise<void>
  updateTotalPoints: (newCurrentTotalPoints:number) => Promise<void>
}

export const useTotalPointsStore = create<ScoreState>((set) => ({
  totalPoints: 0,
  isLoading: true,

  fetchTotalPoints: async (userId) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`/api/users/${userId}/points`)
      const data = await response.json()
      set({ totalPoints: data.totalPoints })
    } catch (error) {
      console.error('Failed to fetch score:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  updateTotalPoints: async (newCurrentTotalPoints) => {
        set({totalPoints:newCurrentTotalPoints})
    }
    }
))
