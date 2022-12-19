export function everyAfter(fn: any) {
    let called: boolean, value: any;

    return function wrap(...args) {
        if (!called) {
            called = true;
            return;
        }
        value = fn.apply(this, args);
        // fn = undefined;
        return value;
    };
}