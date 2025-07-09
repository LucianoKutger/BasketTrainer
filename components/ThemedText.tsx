import { Text, useColorScheme, ViewProps, ViewStyle } from 'react-native'
import { Colors } from '../constants/Colors'
import { ThemedTextProps } from '../types/themedTypes'

const ThemedText = ({ style, title = false, ...props }: ThemedTextProps) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]

  const textColor = title ? theme.title : theme.text


  return (
    <Text
      style={[{ color: textColor }, style]}
      {...props}
    />
  )
}

export default ThemedText