import { RefObject, useEffect } from "react";

const isSplitSupported = (
  splitter?: Node | null,
  separator?: HTMLDivElement | null,
) => {
  const childList = splitter?.childNodes.length;
  return childList === 3 && splitter!.childNodes[2] === separator;
};

/**
 * Returns true if the splitter container has 3 child nodes, including the separator.
 * The consumer must render 2 element nodes (not components), to be able to split.
 * @param separatorRef Separator ref
 */
export const useShowSeparator = (separatorRef: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const separator = separatorRef.current as HTMLDivElement;
    const splitter = separator.parentElement as HTMLDivElement;
    setShowSeparator(
      separator,
      splitter,
      isSplitSupported(splitter, separatorRef?.current),
    );
    const observer = new MutationObserver(([{ target }]) =>
      setShowSeparator(
        separator,
        splitter,
        isSplitSupported(target, separatorRef?.current),
      ),
    );
    observer?.observe(splitter!, { childList: true });
    return () => observer?.disconnect();
  }, []);
};

const setShowSeparator = (
  separator: HTMLElement,
  splitter: HTMLElement,
  show?: boolean,
) => {
  if (show) {
    splitter.style.display = "";
    separator.style.display = "";
  } else {
    splitter.style.display = splitter.childNodes.length === 2 ? "block" : "";
    separator.style.display = "none";
  }
};
