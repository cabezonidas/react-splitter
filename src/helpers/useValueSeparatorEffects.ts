import React, { useEffect, useRef, useState } from "react";
import { getSeparatorAttributes } from "./getSeparatorAttributes";
import { transition } from "./transition";

/**
 * Moves separator as per ratio changes. Centers on first render if ratio is undefined.
 */
const useRatioEffect = (
  setValueNow: (val?: number) => void,
  ratio?: number,
  startAt?: number,
) => {
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current || ratio !== undefined) {
      firstRun.current = false;
      // If ratio is undefined, setValueNow will place the separator in the middle as a starting point.
      // Whatever value is `the middle` will be determined by setValueNow
      setValueNow(ratio ?? startAt);
    }
  }, [setValueNow, ratio, firstRun, startAt]);
};

/**
 * Re-arranges the splitter if the limits or orientation change.
 */
const useConfigEffect = (
  setValueNow: (val?: number) => void,
  separator: React.RefObject<HTMLDivElement>,
) => {
  useEffect(() => {
    const callback = () => {
      const { valueNow: value } = getSeparatorAttributes({ ref: separator });
      setValueNow(value);
    };
    callback();
    const observer = new MutationObserver(callback);
    observer.observe(separator.current!, {
      attributeFilter: [
        "aria-orientation",
        "aria-valuemin",
        "aria-valuemax",
        "data-minpx",
        "data-maxpx",
      ],
    });
    return () => observer.disconnect();
  }, [separator, setValueNow]);
};

/**
 * Broadcasts changes if separator aria-valuenow was altered.
 */
const useValueNowEffect = (
  setValueNow: (val?: number) => void,
  separator: React.RefObject<HTMLDivElement>,
) => {
  useEffect(() => {
    const observer = new MutationObserver(([{ target }]) => {
      const el = target as HTMLDivElement;
      const splitter = target.parentElement as HTMLDivElement;
      const newValueNow = Number(el.getAttribute("aria-valuenow"));
      if (!splitter.classList.contains("resizing")) {
        setValueNow(newValueNow);
      }
    });
    const attributeFilter = ["aria-valuenow"];
    observer.observe(separator.current!, { attributeFilter });
    return () => observer.disconnect();
  }, [separator, setValueNow]);
};

/**
 * Makes sure that separator is within boundaries
 */
const useResizeEffect = (
  setValueNow: (val?: number) => void,
  separator: React.RefObject<HTMLDivElement>,
) => {
  const length = useRef<number>();
  const [count, setCount] = useState(0);
  useEffect(() => {
    const element = separator.current!.parentElement!;
    const observer = new ResizeObserver(([{ contentBoxSize }]) => {
      const [{ inlineSize, blockSize }] = contentBoxSize;
      const attributes = getSeparatorAttributes({ ref: separator });
      const { orientation, valueNow, sticky } = attributes;
      let newValue = valueNow;
      const newLength = orientation === "vertical" ? inlineSize : blockSize;
      if (newLength !== length.current) {
        if (length.current) {
          transition(separator).stop();
          if (sticky === "primary") {
            newValue = 0;
          }
          if (sticky === "secondary") {
            newValue = 100;
          }
          setValueNow(newValue);
          setCount((p) => p + 1);
        }
        length.current = newLength;
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [separator, setValueNow, length]);

  useEffect(() => {
    transition(separator).resume();
  }, [count]);
};

/**
 * Calls setValueNow when the separator attributes change.
 */
export const useValueSeparatorEffects = (
  setValueNow: (val?: number) => void,
  separator: React.RefObject<HTMLDivElement>,
  ratio?: number,
  startAt?: number,
) => {
  useRatioEffect(setValueNow, ratio, startAt);
  useConfigEffect(setValueNow, separator);
  useValueNowEffect(setValueNow, separator);
  useResizeEffect(setValueNow, separator);
};
