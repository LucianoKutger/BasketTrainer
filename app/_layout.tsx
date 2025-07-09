import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useColorScheme } from "react-native"
import { Colors } from "../constants/Colors"
import { StatsProvider } from "../contexts/StatsContext"
import { UserProvider } from "../contexts/UserContext"

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]

  return (
    <UserProvider>
      <StatsProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
          contentStyle: { backgroundColor: theme.background }
        }}>
          {/* Groups */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />

          {/* Individual Screens */}
          <Stack.Screen name="index" options={{ title: "Home" }} />

          {/* Book details screen */}
          {/* <Stack.Screen name="books/[id]" options={} */}
        </Stack>
      </StatsProvider>
    </UserProvider>
  )
}