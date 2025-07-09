import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const saveSession = async (access_token: string, refresh_token: string) => {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
};

export const clearSession = async () => {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getTokens = async () => {
    const access_token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    const refresh_token = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    return { access_token, refresh_token };
};
