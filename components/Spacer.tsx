import { View } from 'react-native'
import { SpacerProps } from '../types/themedTypes'

const Spacer = ({ width = "100%", height = 40 }: SpacerProps) => {
  return (
    <View style={{ width, height }} />
  )
}

export default Spacer