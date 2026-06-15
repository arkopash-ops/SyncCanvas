import type { Tool } from "../components/dashboard/canvas/Toolbar";

export const getCursor = (tool: Tool) => {
    switch (tool) {
        case "pencil":
            return "url('/cursor/pencil-cursor-24.svg') 8 8, auto";

        case "brush":
            return "url('/cursor/brush-cursor-24.svg') 8 8, auto";

        case "eraser":
            return "url('/cursor/eraser-cursor-24.svg') 8 8, auto";

        default:
            return "url('/cursor/plus-cursor-24.svg') 8 8, auto";
    }
}
