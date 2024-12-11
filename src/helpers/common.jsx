import { useRef, useEffect } from "react";
export const useEffectSkipFirst = (callback, dependencies) => {
    const firstRenderRef = useRef(true);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
        } else {
            callback();
        }
    }, [...dependencies]);
};
