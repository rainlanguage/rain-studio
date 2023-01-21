import { derived, writable } from 'svelte/store'

export enum Breakpoints {
    none,
    sm,
    md,
    lg,
    xl,
    _2xl,
}

const breakPointDefs: { breakpoint: Breakpoints, w: number }[] = [
    { breakpoint: Breakpoints._2xl, w: 1536 },
    { breakpoint: Breakpoints.xl, w: 1280 },
    { breakpoint: Breakpoints.lg, w: 1024 },
    { breakpoint: Breakpoints.md, w: 768 },
    { breakpoint: Breakpoints.sm, w: 640 },
    { breakpoint: Breakpoints.none, w: 0 }
]

export const viewportWidth = writable<number>(0)
export const breakpoint = derived<typeof viewportWidth, Breakpoints>(viewportWidth, ($viewportWidth, set) => {
    for (const bp of breakPointDefs) {
        if ($viewportWidth > bp.w) {
            set(bp.breakpoint);
            break;
        }
    }
}, Breakpoints.none);
