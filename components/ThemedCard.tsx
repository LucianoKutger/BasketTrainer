import { StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/Colors'
import { themdeCardProps } from '../types/themedTypes'

const ThemedCard = ({ style, ...props }: themdeCardProps) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? "light"]

  return (
    <View
      style={[{ backgroundColor: theme.uiBackground }, styles.card, style]}
      {...props}
    />
  )
}

export default ThemedCard

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20
  }
})