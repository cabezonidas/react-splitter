import { RefObject } from "react";
import { clampSeparator } from "./clampSeparator";
import { getSeparatorAttributes } from "./getSeparatorAttributes";

/**
 * Returns a value from 0 to 100 that represents the separator position from left to right.
 * @param separatorRef Separator ref
 * @param drag Represents mouse/touch horizontal/vertical coordinate when the user is resizing.
 */
export const getSeparatorPosition = (
  separatorRef: RefObject<HTMLDivElement>,
  drag: number,
) => {
  const splitter = separatorRef.current?.parentElement;
  if (!splitter) {
    return 0;
  }
  const { orientation } = getSeparatorAttributes({ ref: separatorRef });
  const rect = splitter.getBoundingClientRect();
  const getContainerPixels = (prop: string) =>
    parseFloat(getComputedStyle(splitter).getPropertyValue(prop) || "0");
  const lengthProp = orientation !== "horizontal" ? "width" : "height";
  const offsetProp = orientation !== "horizontal" ? "left" : "top";
  const containerLength = rect[lengthProp] || getContainerPixels(lengthProp);
  const containerOffset = rect[lengthProp]
    ? rect[offsetProp]
    : getContainerPixels(offsetProp);
  const value = ((drag - containerOffset) / containerLength) * 100;
  return clampSeparator({ value });
};
