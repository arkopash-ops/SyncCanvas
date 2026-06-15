import { useEffect, useState } from "react";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";

export const useCamera = () => {
    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const camera = { x: 0, y: 0, scale: 1 };
    const setCamera = () => {};

    useEffect(() => {
        const handleResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    const getPointerPosition = (stage: Konva.Stage) => {
        const pointer = stage.getPointerPosition();

        if (!pointer) return null;

        return {
            x: pointer.x,
            y: pointer.y,
        };
    };

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        // Zoom/pan is disabled to keep the canvas fixed to the screen
    };

    return {
        camera,
        viewport,
        setCamera,
        handleWheel,
        getPointerPosition,
    };
};