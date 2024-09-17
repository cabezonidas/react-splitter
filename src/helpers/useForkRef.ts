import { useRef } from "react";

type ForwardedRef<T> =
  | ((instance: T | null) => void)
  | React.MutableRefObject<T | null>
  | null;

export const useForkRef = <T>(forwardedRef: ForwardedRef<T>) => {
  const localRef = useRef<T>(null);
  return (forwardedRef as typeof localRef) || localRef;
};
