import 'react-native-worklets-core';
import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'

import { useEffect } from 'react'
import Spacer from "../components/Spacer"
import ThemedButton from '../components/ThemedButton'
import ThemedLoader from '../components/ThemedLoader'
import ThemedLogo from "../components/ThemedLogo"
import ThemedText from "../components/ThemedText"
import ThemedView from "../components/ThemedView"
import { useUser } from '../hooks/useUser'


const Home = () => {
  const router = useRouter()
  const { user, authChecked } = useUser()

  function handleSubmit() {
    router.replace("/register")
  }


  useEffect(() => {
    if (authChecked && user) {
      router.replace("/profile")
    }
  }, [user, authChecked])



  if (!authChecked) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  } else {

    return (
      <ThemedView style={styles.container}>
        <ThemedLogo />
        <Spacer />

        <ThemedText style={styles.title} title={true}>The Number 1</ThemedText>

        <ThemedText style={{ marginTop: 10, marginBottom: 30 }}>
          Basketball Trainer
        </ThemedText>

        <ThemedButton onPress={handleSubmit}>
          <ThemedText style={{ color: '#f2f2f2' }}>Get Started</ThemedText>
        </ThemedButton>



      </ThemedView>
    )
  }

}


export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    marginVertical: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1
  },
})
