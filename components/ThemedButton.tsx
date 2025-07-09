import { Pressable, StyleSheet } from 'react-native'
import { Colors } from '../constants/Colors'
import { themdeButtonProps } from '../types/themedTypes'

function ThemedButton({ style, ...props }: themdeButtonProps) {

  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10
  },
  pressed: {
    opacity: 0.5
  },
})

export default ThemedButton