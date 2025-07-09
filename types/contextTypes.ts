import { CameraPermissionStatus } from "react-native-vision-camera";
import { FormattedStat } from "./types";
import { User } from "@supabase/supabase-js";

export type UserContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    authChecked: boolean;
};



export type StatsContextType = {
    stat: FormattedStat | undefined;
    stats: FormattedStat[];
    fetchStats: () => Promise<void>;
    fetchStatById: (id: string) => Promise<void>;
    createStat: (data: any) => Promise<void>;
    deleteStat: (id: string) => Promise<void>;
    resetStat: () => Promise<void>;
};

export type PermissionContextType = {
    cameraPermissionStatus: CameraPermissionStatus,
    requestCameraPermission: () => Promise<void>
}
