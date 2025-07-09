import { ViewProps, ViewStyle, DimensionValue, TextProps, TextInputProps, StyleProp, TextStyle, TouchableOpacityProps } from "react-native";

export type ThemedViewProps = ViewProps & {
    safe?: boolean;
    style?: StyleProp<ViewStyle>;
};


export type ThemedTextInputProps = TextInputProps & {
    style?: StyleProp<TextStyle>;
}

export type ThemedTextProps = TextProps & {
    style?: StyleProp<TextStyle>;
    title?: boolean;
}

export type themdeCardProps = ViewProps & {
    style?: StyleProp<ViewStyle>;
}

export type themdeButtonProps = TouchableOpacityProps & {
    style?: StyleProp<ViewStyle>;
}

export type SpacerProps = {
    width?: DimensionValue;
    height?: DimensionValue;
};