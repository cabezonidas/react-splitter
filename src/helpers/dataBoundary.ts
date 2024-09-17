import { ComponentProps } from "react";
import { Splitter } from "../Splitter";

type Props = Pick<ComponentProps<typeof Splitter>, "min" | "max">;
type Result = "keep-secondary" | "keep-primary" | "keep-both";

const attrBoundary = "data-boundary";

const dataBoundary = ({ min, max }: Props): Result => {
  if (typeof min === "undefined" && typeof max !== "undefined") {
    if (typeof max === "string") {
      return parseInt(max) < 0 ? "keep-secondary" : "keep-primary";
    }
  }

  if (typeof max === "undefined" && typeof min !== "undefined") {
    if (typeof min === "string") {
      return parseInt(min) < 0 ? "keep-secondary" : "keep-primary";
    }
  }

  if (typeof max === "string" && typeof min === "string") {
    if (parseInt(max) > 0 && parseInt(min) > 0) {
      return "keep-primary";
    }
    if (parseInt(max) < 0 && parseInt(min) < 0) {
      return "keep-secondary";
    }
  }

  return "keep-both";
};

/**
 * Given boundaries passed as prop, it defines how the grid column/row template will be arranged.
 * and whether the separator will be positioned using right or left absolute values (top or bottom for horizontal).
 * It will use a data- attribute to store this prop derived information for later processing.
 */
export const setDataBoundary = (props: Props) => ({
  [attrBoundary]: dataBoundary(props),
});

/**
 * Util to get what grid arrangement needs to be used to avoid jumps/flashes.
 * The return value is derived from the Splitter props, and stored in a data- attribute.
 */
export const getDataBoundary = (separator: Element): Result | undefined => {
  const boundaryType = separator?.getAttribute(attrBoundary);
  switch (boundaryType) {
    case "keep-primary":
    case "keep-secondary":
    case "keep-both":
      return boundaryType;
    default:
      return undefined;
  }
};
