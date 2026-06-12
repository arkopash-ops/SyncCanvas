import { useEffect, useState } from "react";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;

export const useCamera = () => {
    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [camera, setCamera] = useState({
        x: 0,
        y: 0,
        scale: 1,
    });

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
            x:
                (pointer.x - camera.x) /
                camera.scale,
            y:
                (pointer.y - camera.y) /
                camera.scale,
        };
    };

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();

        const stage = e.target.getStage();

        if (!stage) return;

        const pointer =
            stage.getPointerPosition();

        if (!pointer) return;

        const oldScale = camera.scale;

        const mousePointTo = {
            x:
                (pointer.x - camera.x) /
                oldScale,
            y:
                (pointer.y - camera.y) /
                oldScale,
        };

        const direction =
            e.evt.deltaY > 0 ? -1 : 1;

        const newScale = Math.max(
            MIN_SCALE,
            Math.min(
                MAX_SCALE,
                direction > 0
                    ? oldScale * 1.05
                    : oldScale / 1.05
            )
        );

        setCamera({
            scale: newScale,
            x:
                pointer.x -
                mousePointTo.x * newScale,
            y:
                pointer.y -
                mousePointTo.y * newScale,
        });
    };

    return {
        camera,
        viewport,
        setCamera,
        handleWheel,
        getPointerPosition,
    };
};