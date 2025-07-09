import { useMemo } from 'react';
import { useFrameProcessor } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { LABELS } from './labels';

let lastCall = -Infinity;

export function useYOLOFrameProcessor(
    modelHook: any,
    onDetections: (
        dets: {
            label: string;
            x: number;
            y: number;
            w: number;
            h: number;
            score: number;   // = classProb (roh)
        }[]
    ) => void,
    enable: boolean
) {
    const { resize } = useResizePlugin();

    // JS-Callbacks in den Worklet holen
    const sendDetections = useMemo(
        () => Worklets.createRunOnJS(onDetections),
        [onDetections]
    );
    const debugLog = useMemo(
        () => Worklets.createRunOnJS(console.log),
        []
    );

    // --- Schwellenwerte ---
    const OBJ_CONF_TH = 0.80;   // Objekt-Konfidenz
    const CLS_SCORE_TH = 0.80;  // Klassen-Score
    // auf false stellen, wenn kein Worklet-Log gewünscht

    return useFrameProcessor(
        frame => {
            'worklet';

            if (!enable) return;

            const now = performance.now(); // ✅ kompatibel mit Worklet
            if (now - lastCall < 1000) return; // max. alle 200ms
            lastCall = now;

            if (modelHook.state !== 'loaded' || !modelHook.model) return;

            /* 1) Bild vorbereiten */
            const input = resize(frame, {
                scale: { width: 640, height: 640 },
                pixelFormat: 'rgb',
                dataType: 'uint8',
            });



            /* 2) Model laufen lassen */
            const out = modelHook.model.runSync([input])[0] as number[];



            const C = LABELS.length;
            const dims = 5 + C;
            const nDet = Math.floor(out.length / dims);

            const dets: {
                label: string;
                x: number;
                y: number;
                w: number;
                h: number;
                score: number;
            }[] = [];

            /* 3) Alle Boxen durchgehen */
            for (let i = 0; i < nDet; i++) {
                const base = i * dims;

                const x_c = out[base + 0];
                const y_c = out[base + 1];
                const w = out[base + 2];
                const h = out[base + 3];
                const objCf = out[base + 4];

                if (objCf < OBJ_CONF_TH) continue;

                // beste Klasse finden
                let bestScore = 0;
                let bestIdx = -1;
                for (let c = 0; c < C; c++) {
                    const p = out[base + 5 + c];
                    if (p > bestScore) {
                        bestScore = p;
                        bestIdx = c;
                    }
                }
                if (bestIdx < 0 || bestScore < CLS_SCORE_TH) continue;

                const label = LABELS[bestIdx];
                if (label !== 'Basketball' && label !== 'Net') continue;

                const x0 = x_c - w / 2;
                const y0 = y_c - h / 2;

                dets.push({ label, x: x0, y: y0, w, h, score: bestScore });
            }

            /* 4) Debug-Ausgabe (optional) */
            if (enable && dets.length) {
                debugLog(
                    '🖥️  [Worklet] Detections:',
                    dets.map(d => ({
                        l: d.label,
                        s: +d.score.toFixed(3),
                        x: +d.x.toFixed(1),
                        y: +d.y.toFixed(1),
                        w: +d.w.toFixed(1),
                        h: +d.h.toFixed(1),
                    }))
                );
            }

            /* 5) Ergebnisse an JS schicken */
            sendDetections(dets);
        },
        [modelHook.model, enable]
    );
}
