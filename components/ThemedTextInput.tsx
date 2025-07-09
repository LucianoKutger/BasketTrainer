import { TextInput, useColorScheme, ViewProps, ViewStyle } from 'react-native'
import { Colors } from '../constants/Colors'
import { ThemedTextInputProps } from '../types/themedTypes'

export default function ThemedTextInput({ style, ...props }: ThemedTextInputProps) {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
          padding: 20,
          borderRadius: 6,
        },
        style
      ]}
      placeholderTextColor={theme.text}
      {...props}
    />
  )
}