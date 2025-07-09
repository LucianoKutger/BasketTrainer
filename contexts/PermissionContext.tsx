import { useRouter } from "expo-router"
import { createContext, useEffect, useState } from "react"
import { Alert, Linking } from "react-native"
import { Camera, CameraPermissionStatus } from "react-native-vision-camera"
import { PermissionContextType } from "../types/contextTypes"



export const PermissionContext = createContext<PermissionContextType | null>(null)

export function PermissionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>("not-determined")

    const requestCameraPermission = async () => {
        const permission = await Camera.requestCameraPermission()

        setCameraPermissionStatus(permission)

        if (permission === "denied") {
            Alert.alert(
                "Kamera-Berechtigung verweigert",
                "Bitte erlaube die Kamera in den Einstellungen.",
                [
                    { text: "Abbrechen", style: "cancel" },
                    {
                        text: "Einstellungen öffnen",
                        onPress: () => {
                            // öffnet in iOS & Android die App-Settings
                            Linking.openSettings();
                        },
                    },
                ]
            );
        }
    }

    useEffect(() => {
        const status = Camera.getCameraPermissionStatus()

        if (status !== "granted") {
            router.replace("/permission")
        }


        setCameraPermissionStatus(status)
    }, [])



    return (
        <PermissionContext.Provider value={{
            requestCameraPermission, cameraPermissionStatus
        }}>
            {children}
        </PermissionContext.Provider>
    );
}
