module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],          // ← statt metro-preset
        plugins: [
            ['react-native-worklets-core/plugin'],          // Expo Router zuerst registrieren
            ['react-native-reanimated/plugin'],
        ],
    };
};
