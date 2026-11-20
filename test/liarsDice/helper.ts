// return 0 or 0.99 in turn
export function fakeRandomGenerator(): () => number {
    let isZero = true;
    return () => {
        const value = isZero ? 0 : 0.99;
        isZero = !isZero;
        return value;
    }
        
}