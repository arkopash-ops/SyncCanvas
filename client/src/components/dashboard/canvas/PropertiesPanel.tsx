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
  canEdit: boolean;
  updateShape: (id: string, attrs: Partial<ShapeElement>) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  onDelete: (id: string) => void;
}

const PropertiesPanel = ({
  shape,
  canEdit,
  updateShape,
  bringToFront,
  sendToBack,
  onDelete,
}: Props) => {
  const update = (attr: Partial<ShapeElement>) => {
    if (!canEdit) return;
    updateShape(shape.id, attr);
  };

  return (
    <div className="absolute right-4 top-4 z-50 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <h3 className="mb-4 font-semibold">{canEdit ? "Properties" : "Properties (View Only)"}</h3>

      <div className="mb-4">
        <label className="mb-1 block text-sm">X</label>

        <input
          type="number"
          disabled={!canEdit}
          value={shape.x}
          onChange={(e) => update({ x: Number(e.target.value) })}
          className="w-full rounded border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm">Y</label>

        <input
          type="number"
          disabled={!canEdit}
          value={shape.y}
          onChange={(e) => update({ y: Number(e.target.value) })}
          className="w-full rounded border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm">Rotation</label>

        <input
          type="range"
          disabled={!canEdit}
          min={0}
          max={360}
          value={shape.rotation ?? 0}
          onChange={(e) => update({ rotation: Number(e.target.value) })}
          className="w-full disabled:cursor-not-allowed"
        />
      </div>

      {/* Rectangle */}
      {shape.type === "rectangle" && (
        <>
          <SizeControls shape={shape} update={update} canEdit={canEdit} />
          <StrokeFillControls shape={shape} update={update} canEdit={canEdit} />
        </>
      )}

      {/* Circle */}
      {shape.type === "circle" && (
        <>
          <RadiusControl shape={shape} update={update} canEdit={canEdit} />
          <StrokeFillControls shape={shape} update={update} canEdit={canEdit} />
        </>
      )}

      {/* Triangle */}
      {shape.type === "triangle" && (
        <>
          <RadiusControl shape={shape} update={update} canEdit={canEdit} />
          <StrokeFillControls shape={shape} update={update} canEdit={canEdit} />
        </>
      )}

      {/* Sticky */}
      {shape.type === "sticky" && (
        <>
          <SizeControls shape={shape} update={update} canEdit={canEdit} />
          <StrokeFillControls shape={shape} update={update} canEdit={canEdit} />

          <div className="mb-4">
            <label className="mb-1 block text-sm">Text Color</label>

            <input
              type="color"
              disabled={!canEdit}
              value={shape.textColor}
              onChange={(e) => update({ textColor: e.target.value })}
              className="h-10 w-full disabled:cursor-not-allowed"
            />
          </div>

          <FontSizeControl shape={shape} update={update} canEdit={canEdit} />
        </>
      )}

      {/* Text */}
      {shape.type === "text" && (
        <>
          <div className="mb-4">
            <label className="mb-1 block text-sm">Text Color</label>

            <input
              type="color"
              disabled={!canEdit}
              value={shape.fill}
              onChange={(e) => update({ fill: e.target.value })}
              className="h-10 w-full disabled:cursor-not-allowed"
            />
          </div>

          <FontSizeControl shape={shape} update={update} canEdit={canEdit} />
        </>
      )}

      {/* Layers */}
      <div className="mt-6 flex gap-2">
        <button
          disabled={!canEdit}
          onClick={() => canEdit && bringToFront(shape.id)}
          className="flex-1 rounded bg-blue-500 p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Front
        </button>

        <button
          disabled={!canEdit}
          onClick={() => canEdit && sendToBack(shape.id)}
          className="flex-1 rounded bg-gray-500 p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
      </div>

      {canEdit && (
        <button
          onClick={() => onDelete(shape.id)}
          className="mt-3 w-full rounded bg-red-500 p-2 text-white"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default PropertiesPanel;

interface SizeControlsProp {
  shape: RectangleElement | StickyElement;
  canEdit: boolean;
  update: (attrs: Partial<ShapeElement>) => void;
}

const SizeControls = ({ shape, update, canEdit }: SizeControlsProp) => (
  <>
    <div className="mb-4">
      <label>Width</label>

      <input
        type="number"
        disabled={!canEdit}
        value={shape.width}
        onChange={(e) => update({ width: Number(e.target.value) })}
        className="w-full rounded border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>

    <div className="mb-4">
      <label>Height</label>

      <input
        type="number"
        disabled={!canEdit}
        value={shape.height}
        onChange={(e) => update({ height: Number(e.target.value) })}
        className="w-full rounded border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  </>
);

interface RadiusControlProp {
  shape: CircleElement | TriangleElement;
  canEdit: boolean;
  update: (attrs: Partial<ShapeElement>) => void;
}

const RadiusControl = ({ shape, update, canEdit }: RadiusControlProp) => (
  <div className="mb-4">
    <label>Radius</label>

    <input
      type="number"
      disabled={!canEdit}
      value={shape.radius}
      onChange={(e) => update({ radius: Number(e.target.value) })}
      className="w-full rounded border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
  canEdit: boolean;
  update: (attrs: Partial<ShapeElement>) => void;
}

const StrokeFillControls = ({ shape, update, canEdit }: StrokeFillControlsProp) => (
  <>
    <div className="mb-4">
      <label>Stroke</label>

      <input
        type="color"
        disabled={!canEdit}
        value={shape.stroke}
        onChange={(e) => update({ stroke: e.target.value })}
        className="h-10 w-full disabled:cursor-not-allowed"
      />
    </div>

    <div className="mb-4">
      <label>Fill</label>

      <input
        type="color"
        disabled={!canEdit}
        value={shape.fill}
        onChange={(e) => update({ fill: e.target.value })}
        className="h-10 w-full disabled:cursor-not-allowed"
      />
    </div>
  </>
);

interface FontSizeControlProp {
  shape: TextElement | StickyElement;
  canEdit: boolean;
  update: (attrs: Partial<ShapeElement>) => void;
}

const FontSizeControl = ({ shape, update, canEdit }: FontSizeControlProp) => (
  <div className="mb-4">
    <label>Font Size</label>

    <input
      type="number"
      disabled={!canEdit}
      value={shape.fontSize}
      onChange={(e) => update({ fontSize: Number(e.target.value) })}
      className="w-full rounded border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
);
