import { useRouter } from "expo-router";
import * as React from "react";
import {
    Alert,
    StyleSheet,
    Switch,
    TouchableHighlight,
    useColorScheme,
} from "react-native";


import { Ionicons } from "@expo/vector-icons";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { usePermission } from "../../hooks/usePermission";


const ICON_SIZE = 26;

export default function PermissionsScreen() {
    const router = useRouter();
    const { requestCameraPermission, cameraPermissionStatus } = usePermission()


    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme ?? "light"]



    const handleContinue = () => {
        if (
            cameraPermissionStatus === "granted"

        ) {
            router.replace("/training");
        } else {
            Alert.alert("Please go to settings and enable permissions");
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText title={true}>
                Kamera Berechtigung vergeben
            </ThemedText>
            <Spacer />

            <ThemedView style={styles.row}>
                <Ionicons
                    name="lock-closed-outline"
                    color={theme.iconColorFocused}
                    size={ICON_SIZE}
                />
                <ThemedText style={styles.footnote}>REQUIRED</ThemedText>
            </ThemedView>

            <Spacer />

            <ThemedView
                style={StyleSheet.compose(styles.row, styles.permissionContainer)}
            >
                <Ionicons name="camera-outline" color={theme.iconColorFocused} size={ICON_SIZE} />
                <ThemedView style={styles.permissionText}>
                    <ThemedText>Camera</ThemedText>
                    <ThemedText>Used for capturing the Backboard</ThemedText>

                </ThemedView>
                <Switch
                    trackColor={{ true: Colors.primary }}
                    value={cameraPermissionStatus === "granted"}
                    onValueChange={requestCameraPermission}
                    thumbColor={theme.text}
                />
            </ThemedView>


            <Spacer />
            <Spacer />
            <Spacer />

            <TouchableHighlight
                onPress={handleContinue}
                style={StyleSheet.compose(styles.row, styles.continueButton)}
            >
                <Ionicons
                    name="arrow-forward-outline"
                    color={"white"}
                    size={ICON_SIZE}
                />
            </TouchableHighlight>
        </ThemedView >

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headLine: {
        textAlign: "center",
        padding: 20
    },
    footnote: {
        fontSize: 12,
        fontWeight: "bold",
        letterSpacing: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    spacer: {
        marginVertical: 8,
    },
    permissionContainer: {
        backgroundColor: "#ffffff20",
        borderRadius: 10,
        padding: 10,
        justifyContent: "space-between",
        margin: 10
    },
    permissionText: {
        borderRadius: 10,
        marginLeft: 10,
        flexShrink: 1,
        alignItems: "center",
        padding: 10
    },
    continueButton: {
        padding: 10,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 50,
        alignSelf: "center",
    },
});