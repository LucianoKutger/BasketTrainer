// utils/helper.ts
export function mapBoxToPreview(
    b: { x: number; y: number; w: number; h: number },
    vw: number, vh: number
) {
    const rView = vw / vh
    if (rView >= 1) {
        // Landscape: links/rechts gecroppt
        const scale = vh / vw
        const dx = (1 - scale) / 2
        return {
            x: (b.x - dx) / scale,
            y: b.y,
            w: b.w / scale,
            h: b.h,
        }
    } else {
        // Portrait: oben/unten gecroppt
        const scale = vw / vh
        const dy = (1 - scale) / 2
        return {
            x: b.x,
            y: (b.y - dy) / scale,
            w: b.w,
            h: b.h / scale,
        }
    }
}
