import { createContext } from "react";
import * as asyncStorage from "../service/authService";
import { UserContextType } from "../types/contextTypes";
import { PostStat, Stat } from "../types/types";




export const UserContext = createContext<UserContextType | null>(null)

const API_URL = "https://easyreader-proxy.onrender.com"



//Auth Functions

export async function register(email: string, password: string, displayName: string) {
    const response = await fetch(`${API_URL}/basketTrainer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password,
            display_name: displayName
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registrieren Fehlgeschlagen")
    }

    const { access_token, refresh_token, user } = await response.json()

    asyncStorage.saveSession(access_token, refresh_token)

    return user
}

export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/basketTrainer/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login fehlgeschlagen")
    }

    const { access_token, refresh_token, user } = await response.json()

    asyncStorage.saveSession(access_token, refresh_token)

    return user

}

export async function logout() {
    try {
        const { refresh_token } = await asyncStorage.getTokens()

        if (refresh_token) {
            await fetch(`${API_URL}/basketTrainer/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refresh_token }),
            });
        }

        await asyncStorage.clearSession()

    } catch (error: any) {

        throw error
    }

}


export async function getInitialUserValue() {
    try {
        const { refresh_token } = await asyncStorage.getTokens();

        if (refresh_token) {
            const refreshedToken = await fetch(`${API_URL}/basketTrainer/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refresh_token: refresh_token
                }),
            });


            if (refreshedToken.ok) {
                const { refresh_token, access_token, user } = await refreshedToken.json()
                await asyncStorage.saveSession(access_token, refresh_token)

                return user

            } else return null

        } else {

            return null

        }
    } catch (error) {

        throw error

    }
}


//Database Functions    


export async function getStats(userId: string): Promise<Stat[]> {
    try {
        const token = await getValidAccessToken()

        const stats = await fetch(`${API_URL}/basketTrainer/getStats`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: userId
            }),
        })

        if (!stats.ok) {
            const error = await stats.json();
            throw new Error(error || "Keine Stats gefunden")
        }

        const { statsData } = await stats.json()

        return statsData


    } catch (error: any) {
        throw error
    }
}


export async function getStatById(statId: string, userId: string): Promise<Stat> {

    try {
        const token = await getValidAccessToken()

        const stat = await fetch(`${API_URL}/basketTrainer/getStatById`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                statId: statId,
                userId: userId
            })
        });

        if (!stat.ok) {
            const error = await stat.json()
            throw new Error(error || "Stat nicht gefunden")
        }

        const { statData } = await stat.json()

        return statData

    } catch (error: any) {
        throw error
    }

}

export async function postStat(stat: PostStat) {
    try {
        const token = await getValidAccessToken()

        const response = await fetch(`${API_URL}/basketTrainer/postStat`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                stat: stat
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error || "Posten Fehlgeschlagen")
        }

        const { statData } = await response.json()

        return statData

    } catch (error: any) {

        throw error
    }
}

export async function deleteStat(statId: string) {

    try {
        const token = await getValidAccessToken()

        const response = await fetch(`${API_URL}/basketTrainer/deleteStat?statId=${statId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error || "Löschen Fehlgeschlagen")
        }

    } catch (error: any) {
        throw error
    }

}


//SONSTIGE FUNCTIONS

export async function getValidAccessToken() {
    const { refresh_token } = await asyncStorage.getTokens()

    try {

        const response = await fetch(`${API_URL}/basketTrainer/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                refresh_token: refresh_token
            }),
        });

        if (!response.ok) {
            throw new Error("Session abgelaufen. Bitte erneut einloggen.");
        }

        const data = await response.json();

        await asyncStorage.saveSession(data.access_token, data.refresh_token)

        return data.access_token

    } catch (error) {

        throw error
    }


}