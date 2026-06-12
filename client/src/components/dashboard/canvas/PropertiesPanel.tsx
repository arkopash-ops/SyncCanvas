import type {
  CircleElement,
  RectangleElement,
  ShapeElement,
  StickyElement,
  TextElement,
  TriangleElement,
} from "../../../types/board.types";

interface Props {
  shape: ShapeElement;

  updateShape: (id: string, attrs: Partial<ShapeElement>) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  onDelete: (id: string) => void;
}

const PropertiesPanel = ({
  shape,
  updateShape,
  bringToFront,
  sendToBack,
  onDelete,
}: Props) => {
  const update = (attr: Partial<ShapeElement>) => {
    updateShape(shape.id, attr);
  };

  return (
    <div className="absolute right-4 top-4 z-50 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <h3 className="mb-4 font-semibold">Properties</h3>

      <div className="mb-4">
        <label className="mb-1 block text-sm">X</label>

        <input
          type="number"
          value={shape.x}
          onChange={(e) => update({ x: Number(e.target.value) })}
          className="w-full rounded border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm">Y</label>

        <input
          type="number"
          value={shape.y}
          onChange={(e) => update({ y: Number(e.target.value) })}
          className="w-full rounded border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm">Rotation</label>

        <input
          type="range"
          min={0}
          max={360}
          value={shape.rotation ?? 0}
          onChange={(e) => update({ rotation: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Rectangle */}
      {shape.type === "rectangle" && (
        <>
          <SizeControls shape={shape} update={update} />
          <StrokeFillControls shape={shape} update={update} />
        </>
      )}

      {/* Circle */}
      {shape.type === "circle" && (
        <>
          <RadiusControl shape={shape} update={update} />
          <StrokeFillControls shape={shape} update={update} />
        </>
      )}

      {/* Triangle */}
      {shape.type === "triangle" && (
        <>
          <RadiusControl shape={shape} update={update} />
          <StrokeFillControls shape={shape} update={update} />
        </>
      )}

      {/* Sticky */}
      {shape.type === "sticky" && (
        <>
          <SizeControls shape={shape} update={update} />
          <StrokeFillControls shape={shape} update={update} />

          <div className="mb-4">
            <label className="mb-1 block text-sm">Text Color</label>

            <input
              type="color"
              value={shape.textColor}
              onChange={(e) => update({ textColor: e.target.value })}
              className="h-10 w-full"
            />
          </div>

          <FontSizeControl shape={shape} update={update} />
        </>
      )}

      {/* Text */}
      {shape.type === "text" && (
        <>
          <div className="mb-4">
            <label className="mb-1 block text-sm">Text Color</label>

            <input
              type="color"
              value={shape.fill}
              onChange={(e) => update({ fill: e.target.value })}
              className="h-10 w-full"
            />
          </div>

          <FontSizeControl shape={shape} update={update} />
        </>
      )}

      {/* Layers */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => bringToFront(shape.id)}
          className="flex-1 rounded bg-blue-500 p-2 text-white"
        >
          Front
        </button>

        <button
          onClick={() => sendToBack(shape.id)}
          className="flex-1 rounded bg-gray-500 p-2 text-white"
        >
          Back
        </button>
      </div>

      <button
        onClick={() => onDelete(shape.id)}
        className="mt-3 w-full rounded bg-red-500 p-2 text-white"
      >
        Delete
      </button>
    </div>
  );
};

export default PropertiesPanel;

interface SizeControlsProp {
  shape: RectangleElement | StickyElement;
  update: (attrs: Partial<ShapeElement>) => void;
}

const SizeControls = ({ shape, update }: SizeControlsProp) => (
  <>
    <div className="mb-4">
      <label>Width</label>

      <input
        type="number"
        value={shape.width}
        onChange={(e) => update({ width: Number(e.target.value) })}
        className="w-full rounded border p-2"
      />
    </div>

    <div className="mb-4">
      <label>Height</label>

      <input
        type="number"
        value={shape.height}
        onChange={(e) => update({ height: Number(e.target.value) })}
        className="w-full rounded border p-2"
      />
    </div>
  </>
);

interface RadiusControlProp {
  shape: CircleElement | TriangleElement;
  update: (attrs: Partial<ShapeElement>) => void;
}

const RadiusControl = ({ shape, update }: RadiusControlProp) => (
  <div className="mb-4">
    <label>Radius</label>

    <input
      type="number"
      value={shape.radius}
      onChange={(e) => update({ radius: Number(e.target.value) })}
      className="w-full rounded border p-2"
    />
  </div>
);

type FillableShape =
  | RectangleElement
  | CircleElement
  | TriangleElement
  | StickyElement;

interface StrokeFillControlsProp {
  shape: FillableShape;
  update: (attrs: Partial<ShapeElement>) => void;
}

const StrokeFillControls = ({ shape, update }: StrokeFillControlsProp) => (
  <>
    <div className="mb-4">
      <label>Stroke</label>

      <input
        type="color"
        value={shape.stroke}
        onChange={(e) => update({ stroke: e.target.value })}
        className="h-10 w-full"
      />
    </div>

    <div className="mb-4">
      <label>Fill</label>

      <input
        type="color"
        value={shape.fill}
        onChange={(e) => update({ fill: e.target.value })}
        className="h-10 w-full"
      />
    </div>
  </>
);

interface FontSizeControlProp {
  shape: TextElement | StickyElement;
  update: (attrs: Partial<ShapeElement>) => void;
}

const FontSizeControl = ({ shape, update }: FontSizeControlProp) => (
  <div className="mb-4">
    <label>Font Size</label>

    <input
      type="number"
      value={shape.fontSize}
      onChange={(e) => update({ fontSize: Number(e.target.value) })}
      className="w-full rounded border p-2"
    />
  </div>
);
