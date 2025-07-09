import { createContext, useEffect, useState } from "react"
import { useUser } from "../hooks/useUser"
import { StatsContextType } from "../types/contextTypes"
import * as supabaseService from "../service/supabaseService"
import { FormattedStat, PostStat } from "../types/types"
import { statMapper, statsMapper } from "../mapper/statMapper"



export const StatsContext = createContext<StatsContextType | null>(null)

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<FormattedStat[]>([])
  const [stat, setStat] = useState<FormattedStat | undefined>()
  const { user } = useUser()

  async function fetchStats() {
    try {
      if (user) {
        const statsData = await supabaseService.getStats(user.id)
        const formattedStatsData = statsMapper(statsData)



        setStats(formattedStatsData)



      } else {
        throw new Error("No User found plaese sign in")
      }

    } catch (error: any) {
      setStats([])
      console.error(error.message)
    }
  }

  async function fetchStatById(id: string) {
    try {

      if (user) {
        const statData = await supabaseService.getStatById(id, user.id)
        const formattedStatData = statMapper(statData)

        setStat(formattedStatData)
      } else {
        throw new Error("No User found plaese sign in")
      }



    } catch (error: any) {
      setStat(undefined)
      console.log(error.message)
    }
  }

  async function createStat(data: PostStat) {
    try {
      await supabaseService.postStat(data)

    } catch (error: any) {
      console.log(error.message)
    }
  }

  async function deleteStat(id: string) {
    try {
      await supabaseService.deleteStat(id)

    } catch (error: any) {
      console.log(error.message)
    }
  }

  async function resetStat() {
    setStat(undefined)
  }

  useEffect(() => {
    async function loadStats() {

      if (user) {
        await fetchStats()



      } else {
        setStats([])
      }
    }

    loadStats()

    return () => {

    }

  }, [user])

  return (
    <StatsContext.Provider
      value={{ stat, stats, fetchStats, fetchStatById, createStat, deleteStat, resetStat }}
    >
      {children}
    </StatsContext.Provider>
  )
}
