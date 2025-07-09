import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useUser } from '../../hooks/useUser'

import ThemedLoader from '../ThemedLoader'

const UserOnly = ({ children }: { children: React.ReactNode }) => {
  const { user, authChecked } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace("/login")
    }
  }, [user, authChecked])


  if (!authChecked || !user) {
    return (
      <ThemedLoader />
    )
  }

  return children
}

export default UserOnly