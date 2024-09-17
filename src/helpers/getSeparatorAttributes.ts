import { RefObject } from "react";
import { getDataBoundary } from "./dataBoundary";

type Props =
  | { child: Element | null | undefined; separator?: never; ref?: never }
  | { child?: never; separator: Element | null | undefined; ref?: never }
  | {
      child?: never;
      separator?: never;
      ref?: RefObject<HTMLElement> | null | undefined;
    };

/**
 * Given a ref/element if finds the Separator and returns the most useful attributes
 */
export const getSeparatorAttributes = (props: Props) =>
  getValues(
    (props.child
      ? props.child?.closest('[role="separator"]')
      : (props.separator ?? props.ref?.current))!,
  );

const getBoundary = (length: number, px: string, offset: number) => {
  const asNumber = parseFloat(px);
  const absolute = Math.abs(asNumber) + offset;
  const percentage = absolute / length;
  if (px === "-0px") {
    return 100;
  }
  if (asNumber >= 0) {
    return percentage * 100;
  } else {
    return (1 - percentage) * 100;
  }
};

const getValues = (el: Element) => {
  let valueMin = parseValue(el?.getAttribute("aria-valuemin") ?? "0");
  let valueMax = parseValue(el?.getAttribute("aria-valuemax") ?? "100");
  const thickness = getSeparatorThickness(el);
  const minPx = el?.getAttribute("data-minpx");
  const maxPx = el?.getAttribute("data-maxpx");
  const orientation = parseOrientation(el?.getAttribute("aria-orientation"));

  const rect = el?.parentElement?.getBoundingClientRect();
  const dimension = orientation === "horizontal" ? "height" : "width";
  const length = rect?.[dimension] ?? 0;

  if (minPx?.endsWith("px")) {
    const boundaryMin = getBoundary(length, minPx, thickness / 2);
    valueMin = Math.max(valueMin, boundaryMin);
  }

  if (maxPx?.endsWith("px")) {
    const boundaryMax = getBoundary(length, maxPx, thickness / 2);
    valueMax = Math.min(valueMax, boundaryMax);
  }

  const sticky = el?.getAttribute("data-sticky") as
    | "primary"
    | "secondary"
    | undefined;

  return {
    valueNow: parseValue(el?.getAttribute("aria-valuenow")),
    valueMax,
    valueMin,
    orientation,
    thickness,
    boundary: getDataBoundary(el),
    sticky,
  };
};

const parseValue = (val?: string | null) => {
  const parsed = parseFloat(val ?? "");
  return isNaN(parsed) ? 0 : parsed;
};

const parseOrientation = (
  val?: string | null,
): "horizontal" | "vertical" | undefined =>
  val === "horizontal" || val === "vertical" ? val : undefined;

/**
 * Gets the separator width based on the splitter column gap.
 */
const getSeparatorThickness = (separator: Element) => {
  const initialGap = 4;
  const splitter = separator?.parentElement;
  if (!splitter) {
    return initialGap;
  }
  const property =
    separator?.getAttribute("aria-orientation") === "horizontal"
      ? "row-gap"
      : "column-gap";
  const parsed = parseFloat(
    getComputedStyle(splitter).getPropertyValue(property) || "",
  );
  return isNaN(parsed) ? initialGap : parsed;
};
