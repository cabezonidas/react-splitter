import { getSeparatorAttributes } from "./getSeparatorAttributes";

/**
 * It will calculate the best grid arrangement, based on the min/max props passed to the Splitter.
 * All grid options work. The preference `1fr XXpx` over `(width - XXpx) 1fr` depends on the type of boundary
 * to avoid calculation of position when the window is being resized while trying to retain the collapsed state
 * on a min/max value fixed in pixels (e.g. 200px). Such calculation adds unnecessary lagging on the separator
 * to catch up. This function aims to avoid such lagging during resizing.
 * primary relates to top/left
 * secondary relates to right/bottom
 */
export const getGridTemplate = (separator: HTMLDivElement) => {
  const {
    valueNow,
    thickness: gap,
    boundary,
    orientation,
  } = getSeparatorAttributes({ separator });
  const rect = separator.parentElement!.getBoundingClientRect();
  const dimension = orientation === "horizontal" ? "height" : "width";

  const seperatorAbsolutePx = (rect[dimension] / 100) * valueNow;
  const offset = gap / 2;

  const clamp = (val: number, type: "%" | "px") =>
    `clamp(${offset}px, ${val}${type}, calc(100% - ${offset}px))`;

  if (boundary === "keep-primary") {
    const grid = Math.max(seperatorAbsolutePx - offset, 0);
    return {
      grid: `${grid}px 1fr`,
      primary: clamp(seperatorAbsolutePx, "px"),
      secondary: "",
    };
  }

  if (boundary === "keep-secondary") {
    const grid = Math.max(rect[dimension] - seperatorAbsolutePx - offset, 0);
    return {
      grid: `1fr ${grid}px`,
      primary: "",
      secondary: clamp(rect[dimension] - seperatorAbsolutePx, "px"),
    };
  }

  return {
    grid: `min(calc(${valueNow}% - ${gap / 2}px), calc(100% - ${gap}px)) 1fr`,
    primary: clamp(valueNow, "%"),
    secondary: `calc(100% - ${clamp(valueNow, "%")})`,
  };
};
