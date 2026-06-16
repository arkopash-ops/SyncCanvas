import { useMemo, useState } from "react";
import { FaRegCircle, FaRegStickyNote } from "react-icons/fa";
import { BiText } from "react-icons/bi";
import {
  LuMinus,
  LuSquare,
  LuPaintbrush,
  LuEraser,
  LuChevronRight,
} from "react-icons/lu";
import { PiCursorFill, PiPencilSimple } from "react-icons/pi";
import { TbTriangle } from "react-icons/tb";

export type ShapeTool = "rectangle" | "circle" | "triangle" | "line";

export type DrawTool = "pencil" | "brush" | "eraser";

export type Tool = "select" | ShapeTool | "text" | DrawTool | "sticky";

export type MenuType = "shapes" | "draw" | null;

interface ToolbarProps {
  activeTool: Tool;
  activeColor: string;
  canEdit: boolean;
  onToolChange: (tool: Tool) => void;
  onColorChange: (color: string) => void;
}

const COLORS = [
  "#000000",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#f97316",
];

const shapeTools = [
  { id: "rectangle" as const, icon: LuSquare, label: "Rectangle" },
  { id: "circle" as const, icon: FaRegCircle, label: "Circle" },
  { id: "triangle" as const, icon: TbTriangle, label: "Triangle" },
  { id: "line" as const, icon: LuMinus, label: "Line" },
];

const drawTools = [
  { id: "pencil" as const, icon: PiPencilSimple, label: "Pencil" },
  { id: "brush" as const, icon: LuPaintbrush, label: "Brush" },
  { id: "eraser" as const, icon: LuEraser, label: "Eraser" },
];

const Toolbar = ({
  activeTool,
  activeColor,
  canEdit,
  onToolChange,
  onColorChange,
}: ToolbarProps) => {
  const [openMenu, setOpenMenu] = useState<MenuType>(null);

  const activeShape = useMemo(
    () => shapeTools.find((t) => t.id === activeTool) || shapeTools[0],
    [activeTool],
  );

  const activeDraw = useMemo(
    () => drawTools.find((t) => t.id === activeTool) || drawTools[0],
    [activeTool],
  );

  const mainTools = [
    {
      id: "select",
      icon: PiCursorFill,
      label: "Select",
    },
    {
      id: "shapes",
      icon: activeShape.icon,
      label: "Shapes",
    },
    {
      id: "text",
      icon: BiText,
      label: "Text",
    },
    {
      id: "draw",
      icon: activeDraw.icon,
      label: "Draw",
    },
    {
      id: "sticky",
      icon: FaRegStickyNote,
      label: "Sticky",
    },
  ];

  return (
    <>
      {/* Main Toolbar */}
      <div className="absolute left-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
        {mainTools.map((tool) => {
          const Icon = tool.icon;

          const isActive =
            tool.id === activeTool ||
            (tool.id === "shapes" &&
              shapeTools.some((s) => s.id === activeTool)) ||
            (tool.id === "draw" && drawTools.some((d) => d.id === activeTool));

          return (
            <button
              key={tool.id}
              title={tool.label}
              disabled={!canEdit && tool.id !== "select"}
              onClick={() => {
                if (!canEdit || tool.id === "select") {
                  if (tool.id !== "select") return;
                }

                if (tool.id === "shapes") {
                  setOpenMenu(openMenu === "shapes" ? null : "shapes");
                  return;
                }

                if (tool.id === "draw") {
                  setOpenMenu(openMenu === "draw" ? null : "draw");
                  return;
                }

                onToolChange(tool.id as Tool);
                setOpenMenu(null);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                isActive ? "bg-black text-white" : "hover:bg-gray-100"
              } ${!canEdit && tool.id !== "select" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Icon size={18} />

              {(tool.id === "shapes" || tool.id === "draw") && (
                <LuChevronRight size={12} className="absolute right-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sub Toolbar */}
      {openMenu && (
        <div className="absolute left-20 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          {(openMenu === "shapes" ? shapeTools : drawTools).map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                disabled={!canEdit}
                onClick={() => {
                  if (!canEdit) return;
                  onToolChange(tool.id);
                  setOpenMenu(null);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  activeTool === tool.id
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      )}

      {/* Color Palette */}
      {activeTool !== "select" && canEdit && (
        <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`h-8 w-8 rounded-full border-2 ${
                activeColor === color ? "border-black" : "border-transparent"
              }`}
              style={{
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Toolbar;
