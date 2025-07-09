import { useRouter } from 'expo-router'
import { FlatList, Pressable, StyleSheet } from 'react-native'
import { Colors } from '../../constants/Colors'
import { useStats } from '../../hooks/useStats'

import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import Spacer from "../../components/Spacer"
import ThemedCard from "../../components/ThemedCard"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"



const Stats = () => {
  const { stats, fetchStats } = useStats()
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      async function getStats() {
        await fetchStats()
      }
      getStats()
    }, [])
  )

  return (
    <ThemedView style={styles.container} safe={true}>

      <Spacer />
      <ThemedText title={true} style={styles.heading}>
        Your Reading List
      </ThemedText>

      <Spacer />
      <FlatList
        data={stats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/stats/${item.id}`)}>
            <ThemedCard style={styles.card}>
              <ThemedText style={styles.title}>{item.formattedDate}</ThemedText>
              <ThemedText>Attampts/Made Shots {item.attempts}/{item.madeShots}</ThemedText>
            </ThemedCard>
          </Pressable>
        )}
      />

    </ThemedView>
  )
}

export default Stats

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  list: {
    marginTop: 40,
    paddingBottom: 90,
  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
})