import { useState, useEffect } from "react";

// Pass in your existing `loading` boolean state.
// Returns `isSlow` = true if loading has been going on longer than the threshold (cold start).
export function useSlowLoading(loading, thresholdMs = 4000) {
    const [isSlow, setIsSlow] = useState(false);

    useEffect(() => {
        if (!loading) {
            setIsSlow(false);
            return;
        }
        const timer = setTimeout(() => setIsSlow(true), thresholdMs);
        return () => clearTimeout(timer);
    }, [loading, thresholdMs]);

    return isSlow;
}