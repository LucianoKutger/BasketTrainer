import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

import GuestOnly from "../../components/auth/GuestOnly"
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";

export default function AuthLayout() {

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <GuestOnly>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{ headerShown: false, animation: "none", contentStyle: { backgroundColor: theme.background } }}
      />
    </GuestOnly>
  )
}