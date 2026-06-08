import { BiGridAlt } from "react-icons/bi";
import { BsListTask } from "react-icons/bs";

type Props = {
  view: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
};

const ViewToggle = ({ view, onChange }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange("grid")}
        className={`p-2 rounded-lg transition border ${
          view === "grid"
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-white/40 text-indigo-600 border-white/30"
        }`}
      >
        <BiGridAlt className="text-2xl" />
      </button>

      <button
        onClick={() => onChange("list")}
        className={`p-2 rounded-lg transition border ${
          view === "list"
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-white/40 text-indigo-600 border-white/30"
        }`}
      >
        <BsListTask className="text-2xl" />
      </button>
    </div>
  );
};

export default ViewToggle;
