import { RefObject, useRef } from "react";

const getSeparator = (splitter: RefObject<HTMLDivElement>) => {
  const lastChild = splitter.current?.lastChild as HTMLDivElement;
  return lastChild?.getAttribute("role") === "separator"
    ? lastChild
    : undefined;
};

export const useSplitterRef = () => {
  const ref = useRef<HTMLDivElement>(null);

  const setRatio = (val: number) => {
    const separator = getSeparator(ref);
    if (separator) {
      separator.setAttribute("aria-valuenow", String(val));
    }
  };

  return { ref, setRatio };
};
