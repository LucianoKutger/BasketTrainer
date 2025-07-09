import { useTensorflowModel } from 'react-native-fast-tflite';

export function useObjectModel() {
    return useTensorflowModel(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../assets/ml/ScoreTrainer_float16.tflite'), "default"
    );
}