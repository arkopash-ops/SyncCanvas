import type { StickyElement, TextElement } from "../../../types/board.types";
import type { CameraState } from "../../../types/canvas.types";

interface Props {
  shape: TextElement | StickyElement;
  camera: CameraState;
  value: string;
  canEdit: boolean;
  onChange: (value: string) => void;
  onFinish: () => void;
}

const TextEditorOverlay = ({
  shape,
  camera,
  value,
  canEdit,
  onChange,
  onFinish,
}: Props) => {
  const screenX = shape.x * camera.scale + camera.x;
  const screenY = shape.y * camera.scale + camera.y;
  const screenWidth = shape.width * camera.scale;

  const screenHeight = ("height" in shape ? shape.height : 50) * camera.scale;
  const fontColor = shape.type === "sticky" ? shape.textColor : shape.fill;
  const bgColor = shape.type === "sticky" ? shape.fill : "transparent";

  return (
    <textarea
      style={{
        position: "absolute",

        left: `${screenX}px`,
        top: `${screenY}px`,

        width: `${Math.max(20, screenWidth)}px`,
        height: `${Math.max(40, screenHeight)}px`,

        fontSize: `${shape.fontSize * camera.scale}px`,
        color: fontColor,
        background: bgColor,
        border: "2px solid #3b82f6",
        borderRadius: "4px",
        outline: "none",
        resize: "none",

        zIndex: 100,
        fontFamily: "sans-serif",
        padding: "6px",
        transform: `rotate(${shape.rotation ?? 0}deg)`,
        transformOrigin: "top left",
        boxShadow:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }}
      value={value}
      readOnly={!canEdit}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onFinish}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onFinish();
        }
      }}
      autoFocus
    />
  );
};

export default TextEditorOverlay;
