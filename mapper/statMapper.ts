import { FormattedStat, Stat } from "../types/types";

export function statMapper(stat: Stat): FormattedStat {
    const formattedDate = new Date(stat.created_at).toLocaleDateString('de-DE')

    return {
        ...stat,
        formattedDate
    }

}

export function statsMapper(stats: Stat[]): FormattedStat[] {

    return stats.map(statMapper)

}