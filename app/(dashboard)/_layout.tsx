import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from "../../constants/Colors"

import UserOnly from "../../components/auth/UserOnly"
import { PermissionProvider } from "../../contexts/PermissionContext"

export default function DashboardLayout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]

  return (
    <UserOnly>
      <PermissionProvider>
        <Tabs
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: route.name === "permission" ? { display: "none" } : {
              backgroundColor: theme.navBackground,
              paddingTop: 10,
              height: 90
            },
            tabBarActiveTintColor: theme.iconColorFocused,
            tabBarInactiveTintColor: theme.iconColor,
          })}
        >
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  size={24}
                  name={focused ? 'person' : 'person-outline'}
                  color={focused ? theme.iconColorFocused : theme.iconColor}
                />
              )
            }}
          />
          <Tabs.Screen
            name="stats"
            options={{
              title: "Stats", tabBarIcon: ({ focused }) => (
                <Ionicons
                  size={24}
                  name={focused ? 'book' : 'book-outline'}
                  color={focused ? theme.iconColorFocused : theme.iconColor}
                />
              )
            }}
          />
          <Tabs.Screen
            name="training"
            options={{
              title: "Training", tabBarIcon: ({ focused }) => (
                <Ionicons
                  size={24}
                  name={focused ? 'create' : 'create-outline'}
                  color={focused ? theme.iconColorFocused : theme.iconColor}
                />
              )
            }}
          />
          <Tabs.Screen
            name="stats/[id]"
            options={{ href: null }}
          />
          <Tabs.Screen
            name="permission"
            options={{ href: null }}
          />

        </Tabs>
      </PermissionProvider>
    </UserOnly>
  )
}
