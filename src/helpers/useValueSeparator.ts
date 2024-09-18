import { RefObject, useCallback, useRef } from "react";
import { clampSeparator } from "./clampSeparator";
import { getGridTemplate } from "./getGridTemplate";
import { getSeparatorAttributes } from "./getSeparatorAttributes";
import { useValueSeparatorEffects } from "./useValueSeparatorEffects";

/**
 * Ensures valueNow is set to a valid value within its allowed boundaries.
 * If boundaries and/or initialRatio are not specified, they will be defaulted.
 * It's possible that multiple events trigger setValueNow simultaneosly with the same value.
 * This multiple calls are expected, and setValueNow will resize only once.
 */
export const useValueSeparator = ({
  separator,
  ratio,
  onRatioChanged,
  startAt,
}: {
  ratio?: number;
  onRatioChanged?: (newVal: number) => void;
  separator: RefObject<HTMLDivElement>;
  startAt?: number;
}) => {
  const prev = useRef<number | undefined | null>(null);
  const setValueNow = useCallback(
    (val?: number) => {
      const attributes = getSeparatorAttributes({ ref: separator });
      const { valueNow, valueMax: max, valueMin: min } = attributes;

      const value = val ?? (valueNow || min + (max - min) / 2);
      const newValue = clampSeparator({ value, max, min });
      resize(separator, newValue);
      if (prev.current !== newValue) {
        if (newValue === min) {
          separator.current?.setAttribute("data-sticky", "primary");
        } else if (newValue === max) {
          separator.current?.setAttribute("data-sticky", "secondary");
        } else {
          separator.current?.removeAttribute("data-sticky");
        }
        prev.current = newValue;
        onRatioChanged?.(newValue);
      }
    },
    [onRatioChanged, prev],
  );
  useValueSeparatorEffects(setValueNow, separator, ratio, startAt);
  return { setValueNow };
};

const resize = (separator: RefObject<HTMLDivElement>, value: number) => {
  const newValue = String(value);
  if (!separator.current) {
    return;
  }
  const { thickness: gap, orientation } = getSeparatorAttributes({
    ref: separator,
  });

  if (separator.current.getAttribute("aria-valuenow") !== newValue) {
    separator.current.setAttribute("aria-valuenow", newValue);
  }
  const panels = separator.current.parentElement!.childNodes.length ?? 0;

  const { grid, primary, secondary } = getGridTemplate(separator.current!);

  const gridTemplate = panels === 1 ? "1fr" : grid;

  const splitter = separator.current?.parentElement;
  if (splitter) {
    splitter.style.opacity = "1";
    if (orientation === "vertical") {
      splitter.style.columnGap = `${gap}px`;
      splitter.style.gridTemplateColumns = gridTemplate;
      separator.current.style.width = `${gap}px`;
      separator.current.style.left = primary;
      separator.current.style.right = secondary;
      separator.current.style.height = "100%";
      separator.current.style.transform = `translateX(${primary && "-"}50%)`;
      separator.current.style.cursor = "col-resize";

      splitter.style.rowGap = "";
      splitter.style.gridTemplateRows = "";
      separator.current.style.top = "";
      separator.current.style.bottom = "";
    } else {
      splitter.style.rowGap = `${gap}px`;
      splitter.style.gridTemplateRows = gridTemplate;
      separator.current.style.height = `${gap}px`;
      separator.current.style.top = primary;
      separator.current.style.bottom = secondary;
      separator.current.style.width = "100%";
      separator.current.style.transform = `translateY(${primary && "-"}50%)`;
      separator.current.style.cursor = "row-resize";

      splitter.style.columnGap = "";
      splitter.style.gridTemplateColumns = "";
      separator.current.style.left = "";
      separator.current.style.right = "";
    }
  }
};
