import { useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { ThemedViewProps } from "../types/themedTypes"

const ThemedView = ({ style, safe = false, ...props }: ThemedViewProps) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]

  const insets = useSafeAreaInsets()

  if (!safe) return (
    <View
      style={[{ backgroundColor: theme.background }, style]}
      {...props}
    />
  )


  return (
    <View
      style={[{
        backgroundColor: theme.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }, style]}
      {...props}
    />
  )
}

export default ThemedView