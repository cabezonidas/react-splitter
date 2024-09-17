import React from "react";
import { clsx } from "../helpers/clsx";
import { getSeparatorAttributes } from "../helpers/getSeparatorAttributes";
import { useForkRef } from "../helpers/useForkRef";
import { useControlIcon } from "./useControlIcon";

type Props = {
  side: "primary" | "secondary";
} & JSX.IntrinsicElements["button"];

const squareButtonSide = 25;

export const Control = React.forwardRef<HTMLButtonElement, Props>(
  (props, forwardRef) => {
    const { side, ...buttonProps } = props;
    const ref = useForkRef(forwardRef);

    const { icon, alt } = useControlIcon({ side, control: ref }) ?? {};

    React.useEffect(() => {
      const callback = () => {
        const control = ref.current;
        if (!control) {
          return;
        }
        const { hide, offset, orientation } = getButtonProps(ref, side);
        const vertical = orientation === "vertical";
        control.style.left = vertical ? `${offset}px` : "50%";
        control.style.transform = `translate${vertical ? "Y" : "X"}(-50%)`;
        control.style.top = vertical ? "50%" : `${offset}px`;
        control.style.opacity = `${hide ? 0 : 1}`;
        control.style.pointerEvents = hide ? "none" : "";
        control.tabIndex = hide ? -1 : 0;
      };
      const separator = ref.current!.closest('[role="separator"]')!;
      callback();
      const attributes = new MutationObserver(callback);
      attributes.observe(separator, {
        attributeFilter: [
          "aria-valuenow",
          "aria-valuemin",
          "aria-valuemax",
          "aria-orientation",
          "data-minpx",
          "data-maxpx",
        ],
      });
      const resize = new ResizeObserver(callback);
      resize.observe(separator.parentElement!);
      return () => {
        attributes.disconnect();
        resize.disconnect();
      };
    }, [ref, side]);

    return (
      <button
        ref={ref}
        type="button"
        aria-label={alt}
        title={alt}
        {...buttonProps}
        style={{
          ...buttonProps?.style,
          width: squareButtonSide,
          height: squareButtonSide,
          borderRadius: "50%",
        }}
        className={clsx("Control", icon, buttonProps?.className)}
      />
    );
  },
);

Control.displayName = "Control";

const getButtonProps = (
  button: React.RefObject<HTMLButtonElement>,
  side: "primary" | "secondary",
) => {
  const { valueNow, valueMin, valueMax, orientation, thickness } =
    getSeparatorAttributes({ child: button.current });
  const separator = button.current?.closest('[role="separator"]');
  const splitter = separator?.parentElement as HTMLDivElement | undefined;
  const buttonPadding = thickness * 2;

  const offset =
    side === "primary" ? -(squareButtonSide + buttonPadding) : buttonPadding;
  const splitterRect = splitter?.getBoundingClientRect();
  const splitterExtension =
    orientation === "horizontal" ? splitterRect?.height : splitterRect?.width;

  let hiddenPixels = 0;
  if (splitterExtension !== undefined && valueNow !== undefined) {
    const valueNowPx = (valueNow / 100.0) * splitterExtension;
    hiddenPixels =
      side === "primary"
        ? Math.abs(offset) - valueNowPx
        : squareButtonSide - (splitterExtension - valueNowPx - buttonPadding);
  }
  hiddenPixels = Math.max(hiddenPixels, 0);

  const reachedLimit =
    side === "primary" ? valueMin === valueNow : valueMax === valueNow;

  return { offset, orientation, hide: Boolean(hiddenPixels || reachedLimit) };
};
