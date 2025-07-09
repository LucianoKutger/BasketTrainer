import { createContext, useEffect, useState } from "react"
import * as supabaseService from "../service/supabaseService"
import { UserContextType } from "../types/contextTypes"
import { User } from "@supabase/supabase-js"
import { AppState } from "react-native"

export const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)


  async function login(email: string, password: string) {
    try {

      const userData = await supabaseService.login(email, password)
      setUser(userData)

    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async function register(email: string, password: string, displayName: string) {
    try {
      const userData = await supabaseService.register(email, password, displayName)

      setUser(userData)

    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async function logout() {
    try {
      await supabaseService.logout()
      setUser(null)

    } catch (error: any) {

      console.log(error)

    }

  }

  async function getInitialUserValue() {
    try {

      const userData = await supabaseService.getInitialUserValue()

      setUser(userData)

    } catch (error) {

      setUser(null)

    } finally {

      setAuthChecked(true)

    }
  }

  useEffect(() => {

    async function init() {
      try {
        await getInitialUserValue()
      } catch (error) {
        console.error(error)
      }
    }

    init()

    const handleAppStateChange = async (state: string) => {
      if (state === 'active') {
        try {
          await getInitialUserValue()
        } catch (error) {
          console.error(error)
        }
      }
    }

    const sub = AppState.addEventListener('change', handleAppStateChange)

    return () => sub.remove()
  }, [])



  return (
    <UserContext.Provider value={{
      user, login, logout, register, authChecked
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Wrap the UserProvider component around the root layout stack