import { RefObject } from "react";

const transitionFactory = (attrs: string[], ms: number) =>
  attrs.map((key: string) => `${key} ${ms}ms`).join(", ");

const barTransition = (ms: number) =>
  transitionFactory(["left", "top", "right", "bottom"], ms);

const gridTransition = (ms: number) =>
  transitionFactory(["grid-template-columns", "grid-template-rows"], ms);

export const transition = (
  props: RefObject<HTMLDivElement> | HTMLDivElement,
) => {
  const separator = Object.hasOwn(props, "current")
    ? (props as RefObject<HTMLDivElement>)
    : { current: props as HTMLDivElement };

  const splitter = separator.current?.parentElement;

  const delay = (ms: number) => {
    if (splitter) {
      separator.current.style.transition = barTransition(ms);
      splitter.style.transition = gridTransition(ms);
    }
  };

  const stop = () => delay(0);

  const resume = () =>
    delay(splitter?.classList.contains("resizing") ? 0 : 300);

  return { stop, resume };
};
