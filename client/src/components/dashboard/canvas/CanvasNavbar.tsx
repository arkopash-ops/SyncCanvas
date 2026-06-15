import { useState, useRef, useEffect } from "react";
import type { IUserCursor } from "../../../types/board-presence.types";

type EnrichedMember = IUserCursor & {
  role?: "owner" | "editor" | "viewer";
};

interface CanvasNavbarProps {
  boardName: string;
  members: EnrichedMember[];
}

const getRoleLabel = (role?: string) => {
  switch (role) {
    case "owner":
      return "Owner";
    case "editor":
      return "Editor";
    case "viewer":
      return "Viewer";
    default:
      return "Member";
  }
};

const CanvasNavbar = ({ boardName, members }: CanvasNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white/50 shadow-md">
      <div className="flex-1">
        <h1 className="text-[#3f28d9] text-3xl font-extrabold cursor-pointer">{boardName}</h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-semibold">
            {members.length}
          </div>
          <span className="text-sm text-gray-700">Members</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">Active Members ({members.length})</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {members.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">No members online</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <li key={member.userId} className="p-4 hover:bg-gray-50 flex items-center gap-3">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                        <p className="text-xs text-gray-500">{getRoleLabel(member.role)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasNavbar;
