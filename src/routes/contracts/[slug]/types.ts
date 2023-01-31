export type UserLikes = { [key: string]: boolean };
export type ExpressionLikes = { [key: string]: number };
export type AccountData = {
    [key: string]: { username: string; avatar_url: string | null };
};
