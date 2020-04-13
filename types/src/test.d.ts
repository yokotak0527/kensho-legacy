export interface T1 {
    ptn1: string;
    ptn2: number;
}
export declare type Factory<N extends keyof T1, T extends T1 = T1> = T1[N];
