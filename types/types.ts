export type Stat = {
    id: string;
    created_at: string;
    attempts: number;
    madeShots: number;
    userId: string;
};


export type PostStat = {
    attempts: number;
    madeShots: number;
    userId: string;
};

export type FormattedStat = Stat & {
    formattedDate: string
}