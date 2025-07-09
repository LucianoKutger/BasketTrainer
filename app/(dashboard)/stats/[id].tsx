import { StyleSheet, Text } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Colors } from "../../../constants/Colors"
import { useStats } from "../../../hooks/useStats"


// themed components
import ThemedText from "../../../components/ThemedText"
import ThemedButton from "../../../components/ThemedButton"
import ThemedView from "../../../components/ThemedView"
import Spacer from "../../../components/Spacer"
import ThemedCard from "../../../components/ThemedCard"
import ThemedLoader from "../../../components/ThemedLoader"
import { useUser } from "../../../hooks/useUser"


const StatDetails = () => {
  const { user } = useUser()
  const { fetchStatById, deleteStat, stat, resetStat } = useStats()
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [formattedDate, setFormattedDate] = useState<string | null>(null)



  if (typeof id !== 'string') {
    throw new Error('Invalid ID')
  }

  const handleDelete = async () => {
    await deleteStat(id)
    resetStat()
    router.replace('/stats')
  }

  useEffect(() => {
    async function loadStat() {
      await fetchStatById(id as string)

      if (stat) {
        setFormattedDate(new Date(stat.created_at).toLocaleDateString())
      }

    }

    loadStat()

    return () => {
      async function deleteStat() {
        await resetStat()
        setFormattedDate(null)
      }

      deleteStat()
    }
  }, [id])

  if (!stat) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  return (
    <ThemedView safe={true} style={styles.container}>
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.title}>{user?.user_metadata.display_name}</ThemedText>
        <ThemedText>Trainiert am {formattedDate}</ThemedText>
        <Spacer />

        <ThemedText title={true}>Würfe: {stat.attempts}</ThemedText>
        <Spacer height={10} />

        <ThemedText>Getroffen: {stat.madeShots}</ThemedText>
      </ThemedCard>

      <ThemedButton onPress={handleDelete} style={styles.delete}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Delete Stat</Text>
      </ThemedButton>
    </ThemedView>
  )
}

export default StatDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
  },
  card: {
    margin: 20
  },
  delete: {
    marginTop: 40,
    backgroundColor: Colors.warning,
    width: 200,
    alignSelf: "center",
  },
})
