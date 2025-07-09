// global.d.ts
import 'react-native-vision-camera';

declare module 'react-native-vision-camera' {
    interface CameraProps {
        /** Optional frame rate for the frame processor (since RNVC v2.15) */
        frameProcessorFps?: number;
    }
}