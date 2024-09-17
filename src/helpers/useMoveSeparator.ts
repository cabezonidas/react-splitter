import { RefObject, useEffect, useState } from "react";
import { getSeparatorAttributes } from "./getSeparatorAttributes";
import { getSeparatorPosition } from "./getSeparatorPosition";
import { transition } from "./transition";

/**
 * It captures window events to report a new position.
 * Provides necessary handlers for separator.
 */
export const useMoveSeparator = (
  separator: RefObject<HTMLDivElement>,
  resize: (val: number) => void,
) => {
  const [resizing, setResizing] = useState(false);
  const values = () => getSeparatorAttributes({ ref: separator });

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      const key = values().orientation === "horizontal" ? "clientY" : "clientX";
      const drag =
        e.type === "mousemove"
          ? (e as MouseEvent)[key]
          : (e as TouchEvent).touches[0]?.[key];
      if (resizing && drag !== undefined) {
        resize(getSeparatorPosition(separator, drag));
      }
    };
    const mouseup = () => setResizing(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("click", mouseup);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("click", mouseup);
    };
  }, [separator, resizing]);

  useEffect(() => {
    animateSeparator(
      separator,
      resizing ? "clear-transition" : "add-transition",
    );
  }, [separator, resizing]);

  return {
    onMouseDown: () => setResizing(true),
    onTouchStart: () => setResizing(true),
    onTouchEnd: () => setResizing(false),
    onBlur: () => setResizing(false),
  };
};

const animateSeparator = (
  separatorRef: RefObject<HTMLDivElement>,
  animate: "clear-transition" | "add-transition",
) => {
  const separator = separatorRef.current;
  const splitter = separator?.parentElement as HTMLDivElement;
  if (separator && splitter) {
    if (animate === "clear-transition") {
      splitter.style.cursor =
        separator.getAttribute("aria-orientation") === "vertical"
          ? "col-resize"
          : "row-resize";
      splitter.classList.add("resizing");
      transition(separator).stop();
    } else {
      splitter.style.cursor = "";
      splitter.classList.remove("resizing");
      transition(separator).resume();
    }
  }
};
