import React from 'react';
import { StyleSheet, View } from 'react-native';

export const BoundingBoxOverlay = ({ detections }: { detections: any[] }) => {
    return (
        <View style={StyleSheet.absoluteFill}>
            {detections.map((det, i) => (
                <View
                    key={i}
                    style={[
                        styles.box,
                        {
                            left: det.rect.x,
                            top: det.rect.y,
                            width: det.rect.w,
                            height: det.rect.h,
                            borderColor: 'red',
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        position: 'absolute',
        borderWidth: 2,
        borderRadius: 4,
    },
});
