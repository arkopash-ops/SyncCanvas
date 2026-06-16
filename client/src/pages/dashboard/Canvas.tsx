import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type Konva from "konva";

import type { ShapeElement } from "../../types/board.types";
import type { IUserCursor } from "../../types/board-presence.types";
import type { WorkspaceMemberDetails } from "../../types";

import CanvasNavbar from "../../components/dashboard/canvas/CanvasNavbar";
import Toolbar, { type Tool } from "../../components/dashboard/canvas/Toolbar";
import CanvasStage from "../../components/dashboard/canvas/CanvasStage";
import PropertiesPanel from "../../components/dashboard/canvas/PropertiesPanel";
import TextEditorOverlay from "../../components/dashboard/canvas/TextEditorOverlay";

import { useCamera } from "../../hooks/canvas/useCamera";
import { useCanvasDrawing } from "../../hooks/canvas/useCanvasDrawing";
import { useShapeAction } from "../../hooks/canvas/useShapeActions";
import { useSelection } from "../../hooks/canvas/useSelection";
import { useTextEditing } from "../../hooks/canvas/useTextEditing";
import { useKeyboardShortcuts } from "../../hooks/canvas/useKeyboardShortcuts";
import { useYjsCanvas } from "../../hooks/canvas/useYjsCanvas";
import { userServices } from "../../services/user.services";
import { boardService } from "../../services/board.services";
import { workspaceService } from "../../services/workspace.services";
import { socket } from "../../lib/socket";

import type { KonvaEventObject } from "konva/lib/Node";
import type { CanvasPointerEvent } from "../../types/canvas.types";

const Canvas = () => {
  const { boardId } = useParams<{ boardId: string }>();

  const user = userServices.getStoredUser();

  /** Ref to the Konva Stage — used to capture a thumbnail on exit */
  const stageRef = useRef<Konva.Stage>(null);

  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [activeColor, setActiveColor] = useState("#000000");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shapes, setShapes] = useState<ShapeElement[]>([]);
  const [boardName, setBoardName] = useState("");
  const [members, setMembers] = useState<IUserCursor[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMemberDetails[]>([]);

  const [, setPast] = useState<ShapeElement[][]>([]);
  const [, setFuture] = useState<ShapeElement[][]>([]);

  const shapesRef = useRef<ShapeElement[]>(shapes);
  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  // Fetch board data and workspace members
  useEffect(() => {
    const fetchBoardAndMembers = async () => {
      if (!boardId) return;
      try {
        const boardResponse = await boardService.getBoardById(boardId);
        setBoardName(boardResponse.board.title);

        const workspaceId = typeof boardResponse.board.workspaceId === "string"
          ? boardResponse.board.workspaceId
          : boardResponse.board.workspaceId._id;

        const membersResponse = await workspaceService.getWorkspaceMember(workspaceId);
        setWorkspaceMembers(membersResponse.data);
      } catch (error) {
        console.error("Failed to fetch board or members:", error);
      }
    };

    fetchBoardAndMembers();
  }, [boardId]);

  // Merge active board members with workspace member details (roles, avatars)
  const userRole = useMemo(() => {
    if (!user || !workspaceMembers.length) return "viewer";
    const member = workspaceMembers.find((wm) => {
      const userId = typeof wm.user === "string" ? wm.user : wm.user._id;
      return userId === user._id;
    });
    return member?.role || "viewer";
  }, [user?._id, workspaceMembers]);

  const canEdit = userRole !== "viewer";

  const enrichedMembers = members.map((member) => {
    const workspaceMember = workspaceMembers.find((wm) => {
      const userId = typeof wm.user === "string" ? wm.user : wm.user._id;
      return userId === member.userId;
    });

    const userAvatar = typeof workspaceMember?.user === "object" ? workspaceMember.user.avatar : null;

    return {
      ...member,
      avatar: userAvatar || member.avatar,
      role: workspaceMember?.role || "viewer",
    };
  });

  // Capture thumbnail and clean up when leaving the canvas
  useEffect(() => {
    return () => {
      if (!boardId) return;

      // --- snapshot the stage as a JPEG thumbnail ---
      if (stageRef.current) {
        try {
          const dataURL = stageRef.current.toDataURL({
            pixelRatio: 0.5,       // half-res is plenty for a thumbnail
            mimeType: "image/jpeg",
            quality: 0.8,
          });

          // dataURL → File
          const arr = dataURL.split(",");
          const mimeMatch = arr[0].match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
          const bstr = atob(arr[1]);
          const u8arr = new Uint8Array(bstr.length);
          for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
          const file = new File([u8arr], `thumb-${boardId}.jpg`, { type: mime });

          // fire-and-forget — do NOT await (we are in a cleanup fn)
          boardService
            .updateThumbnail(boardId, { thumbnail: file })
            .catch((err) => console.error("Thumbnail upload failed:", err));
        } catch (err) {
          console.error("Failed to capture stage screenshot:", err);
        }
      }

      socket.emit("leave-board", { boardId });
    };
  }, [boardId]);

  // Listen for member updates
  useEffect(() => {
    const handleBoardCursor = (cursors: IUserCursor[]) => {
      setMembers(cursors);
    };

    const handleCursorMove = (cursor: IUserCursor) => {
      setMembers((prev) => {
        const existing = prev.findIndex((c) => c.userId === cursor.userId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = cursor;
          return updated;
        }
        return [...prev, cursor];
      });
    };

    const handleCursorRemove = (userId: string) => {
      setMembers((prev) => prev.filter((c) => c.userId !== userId));
    };

    socket.on("board-cursor", handleBoardCursor);
    socket.on("cursor-move", handleCursorMove);
    socket.on("cursor-remove", handleCursorRemove);

    return () => {
      socket.off("board-cursor", handleBoardCursor);
      socket.off("cursor-move", handleCursorMove);
      socket.off("cursor-remove", handleCursorRemove);
    };
  }, []);

  const saveToHistory = useCallback(() => {
    setPast((prev) => [...prev, [...shapesRef.current]]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, -1);
      setFuture((prevFuture) => [[...shapesRef.current], ...prevFuture]);
      setShapes(previous);
      return newPast;
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);
      setPast((prevPast) => [...prevPast, [...shapesRef.current]]);
      setShapes(next);
      return newFuture;
    });
  }, []);

  // Yjs / socket sync
  const { syncShapes } = useYjsCanvas({
    boardId: boardId ?? "",
    userId: user?._id ?? "",
    userName: user?.name ?? "Anonymous",
    setShapes,
  });

  const { camera, viewport, handleWheel, getPointerPosition } = useCamera();

  const {
    updateShape: _updateShape,
    deleteShape: _deleteShape,
    bringToFront: _bringToFront,
    sendToBack: _sendToBack,
  } = useShapeAction(setShapes, saveToHistory);

  const updateShape = useCallback(
    (id: string, attrs: Partial<ShapeElement>) => {
      if (!canEdit) return;
      _updateShape(id, attrs);
      setShapes((prev) => {
        const next = prev.map((s) =>
          s.id === id ? ({ ...s, ...attrs } as ShapeElement) : s,
        );
        syncShapes(next);
        return prev;
      });
    },
    [_updateShape, syncShapes, canEdit],
  );

  const deleteShape = useCallback(
    (id: string) => {
      if (!canEdit) return;
      _deleteShape(id);
      setShapes((prev) => {
        const next = prev.filter((s) => s.id !== id);
        syncShapes(next);
        return prev;
      });
    },
    [_deleteShape, syncShapes, canEdit],
  );

  const bringToFront = useCallback(
    (id: string) => {
      if (!canEdit) return;
      _bringToFront(id);
      setShapes((prev) => {
        const selected = prev.find((s) => s.id === id);
        if (!selected) return prev;
        syncShapes([...prev.filter((s) => s.id !== id), selected]);
        return prev;
      });
    },
    [_bringToFront, syncShapes, canEdit],
  );

  const sendToBack = useCallback(
    (id: string) => {
      if (!canEdit) return;
      _sendToBack(id);
      setShapes((prev) => {
        const selected = prev.find((s) => s.id === id);
        if (!selected) return prev;
        syncShapes([selected, ...prev.filter((s) => s.id !== id)]);
        return prev;
      });
    },
    [_sendToBack, syncShapes, canEdit],
  );

  const {
    editingTextId,
    editingValue,
    setEditingValue,
    startEditing,
    stopEditing,
  } = useTextEditing();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp: _handleMouseUp,
  } = useCanvasDrawing({
    activeTool,
    activeColor,
    setShapes,
    setSelectedId,
    getPointerPosition,
    saveToHistory,
    canEdit,
  });

  const handleMouseUp = useCallback(() => {
    _handleMouseUp();
    setShapes((prev) => {
      syncShapes(prev);
      return prev;
    });
  }, [_handleMouseUp, syncShapes]);


  const selectedShape = useSelection(shapes, selectedId);

  useKeyboardShortcuts({
    selectedId,
    editingTextId,
    onDelete: deleteShape,
    onUndo: undo,
    onRedo: redo,
    canEdit,
  });

  const handleSelect = (_e: CanvasPointerEvent, id: string) => {
    setSelectedId(id);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    updateShape(id, { x: e.target.x(), y: e.target.y() });
  };

  const handleTextEdit = (id: string, text: string) => {
    if (!canEdit) return;
    startEditing(id, text);
  };

  const finishEditingText = () => {
    if (!editingTextId) return;
    updateShape(editingTextId, { text: editingValue });
    stopEditing();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 flex flex-col">
      <CanvasNavbar boardName={boardName} members={enrichedMembers} canEdit={canEdit} />

      <div className="relative flex-1 overflow-hidden">
        <Toolbar
          activeTool={activeTool}
          activeColor={activeColor}
          canEdit={canEdit}
          onToolChange={setActiveTool}
          onColorChange={setActiveColor}
        />

        {selectedShape && activeTool === "select" && (
          <PropertiesPanel
            shape={selectedShape}
            canEdit={canEdit}
            updateShape={updateShape}
            bringToFront={bringToFront}
            sendToBack={sendToBack}
            onDelete={deleteShape}
          />
        )}

        {editingTextId &&
          selectedShape &&
          (selectedShape.type === "text" || selectedShape.type === "sticky") && (
            <TextEditorOverlay
              shape={selectedShape}
              camera={camera}
              value={editingValue}
              canEdit={canEdit}
              onChange={setEditingValue}
              onFinish={finishEditingText}
            />
          )}

        <CanvasStage
          stageRef={stageRef}
          viewport={viewport}
          camera={camera}
          activeTool={activeTool}
          selectedId={selectedId}
          canEdit={canEdit}
          shapes={shapes}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onSelect={handleSelect}
          onDragEnd={handleDragEnd}
          updateShape={updateShape}
          onTextEdit={handleTextEdit}
        />
      </div>
    </div>
  );
};

export default Canvas;
