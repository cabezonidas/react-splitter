type Event = Pick<
  React.KeyboardEvent<HTMLDivElement>,
  "currentTarget" | "key" | "ctrlKey" | "shiftKey" | "metaKey" | "altKey"
>;

/**
 * Gets the delta % the separator should move based on key down.
 */
export const getKeyDownDeltaMove = (e: Event, valueNow: number) =>
  getNewValueNow(
    shouldMoveFromKeyDown(e),
    valueNow,
    onePixelAsPercentage(e.currentTarget),
  ) - valueNow;

const onePixelAsPercentage = (separator: HTMLDivElement) => {
  const splitter = separator?.parentElement as HTMLDivElement;
  if (splitter) {
    const splitterWidth = splitter.getBoundingClientRect().width;
    return splitterWidth ? 100 / splitterWidth : 0;
  }
  return 0;
};

const shouldMoveFromKeyDown = (
  e: Event,
): [direction: 0 | 1 | -1, speed: "slow" | "faster" | "fastest"] => {
  const orientation = e.currentTarget.getAttribute("aria-orientation");
  const isPrimary = [
    orientation === "horizontal" ? "ArrowUp" : "ArrowLeft",
    "Home",
  ].includes(e.key);
  const isSecondary = [
    orientation === "horizontal" ? "ArrowDown" : "ArrowRight",
    "End",
  ].includes(e.key);
  const direction = isPrimary ? -1 : isSecondary ? 1 : 0;
  const isMeta = [e.ctrlKey, e.shiftKey, e.metaKey, e.altKey].some(Boolean);
  const isArrow = e.key.startsWith("Arrow");
  const isLimit = ["Home", "End"].includes(e.key);
  const speed = isLimit ? "fastest" : isMeta && isArrow ? "faster" : "slow";
  return [direction, speed];
};

const getNewValueNow = (
  [direction, speed]: ReturnType<typeof shouldMoveFromKeyDown>,
  valueNow: number,
  pixelUnit: number,
) => {
  if (direction) {
    switch (speed) {
      case "slow":
        return valueNow + pixelUnit * direction;
      case "faster":
        return valueNow + 10 * direction;
      case "fastest":
        return direction === -1 ? 0 : 100;
    }
  }
  return valueNow;
};
