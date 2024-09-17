import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  forwardRef,
} from "react";
import { Control } from "../Control/Control";
import { clsx } from "../helpers/clsx";
import { getKeyDownDeltaMove } from "../helpers/getKeyDownDeltaMove";
import { getSeparatorAttributes } from "../helpers/getSeparatorAttributes";
import { useForkRef } from "../helpers/useForkRef";
import { useMoveSeparator } from "../helpers/useMoveSeparator";
import { useShowSeparator } from "../helpers/useShowSeparator";
import { useValueSeparator } from "../helpers/useValueSeparator";
import { Splitter } from "../Splitter";

type Parts = NonNullable<ComponentProps<typeof Splitter>["parts"]>["controls"];

type Props = Exclude<ComponentPropsWithoutRef<"div">, "children"> & {
  parts?: Parts;
  ratio?: number;
  onResized?: (val: number) => void;
  startAt?: number;
};

const cancelEvent = (e: {
  preventDefault: () => void;
  stopPropagation: () => void;
  target: EventTarget;
  currentTarget: EventTarget;
}) => {
  if (e.currentTarget !== e.target) {
    e.preventDefault();
    e.stopPropagation();
  }
};

export const Separator = forwardRef<HTMLDivElement, Props>(
  ({ parts, ratio, onResized, startAt, ...props }, forwardRef) => {
    const separator = useForkRef(forwardRef);

    const { setValueNow } = useValueSeparator({
      ratio,
      separator,
      onResized,
      startAt,
    });
    useShowSeparator(separator);
    const values = () => getSeparatorAttributes({ ref: separator });

    return (
      <div
        ref={separator}
        {...props}
        {...useMoveSeparator(separator, setValueNow)}
        onKeyDown={(e) => {
          const newValueNow = keyDownHandler(e);
          if (values().valueNow !== newValueNow) {
            setValueNow(newValueNow);
            e.preventDefault();
          }
          props?.onKeyDown?.(e);
        }}
        className={clsx("Separator", props.className)}
      >
        <span
          {...parts?.container}
          onMouseDown={cancelEvent}
          onTouchStart={cancelEvent}
          role="group"
        >
          <Control
            {...parts?.primary}
            side="primary"
            data-role="control"
            data-control="primary"
            onClick={(e) => {
              setValueNow(controlClickHandler(e, "primary"));
              parts?.primary?.onClick?.(e);
            }}
          />
          <Control
            {...parts?.secondary}
            side="secondary"
            data-role="control"
            data-control="secondary"
            onClick={(e) => {
              setValueNow(controlClickHandler(e, "secondary"));
              parts?.secondary?.onClick?.(e);
            }}
          />
        </span>
      </div>
    );
  },
);

Separator.displayName = "Separator";

const controlClickHandler = (
  e: React.MouseEvent<Element, MouseEvent>,
  side: "primary" | "secondary",
) => {
  const { valueNow, valueMin, valueMax } = getSeparatorAttributes({
    child: e.currentTarget,
  });
  const valueMiddle = valueMin + (valueMax - valueMin) / 2;
  const newValue = [0, 100].includes(valueNow)
    ? valueMiddle
    : side === "primary"
      ? valueMin
      : valueMax;
  return newValue;
};
const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const { valueNow } = getSeparatorAttributes({
    child: e.currentTarget,
  });
  const delta = getKeyDownDeltaMove(e, valueNow);
  return valueNow + delta;
};
