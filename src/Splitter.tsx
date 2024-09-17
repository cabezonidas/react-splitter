import React from "react";
import { Control } from "./Control/Control";
import { clsx } from "./helpers/clsx";
import { setDataBoundary } from "./helpers/dataBoundary";
import { Separator } from "./Separator/Separator";

type ButtonProps = React.ComponentPropsWithRef<typeof Control>;

type BoundaryPx = { min?: `${number}px`; max?: `${number}px` };
type BoundaryNum = { min?: number; max?: number };
type BoundaryProps = BoundaryPx | BoundaryNum;

type Start = number | "1st-collapsed" | "2nd-collapsed";
type Controlled = { ratio?: number; startAt?: never };
type Uncontrolled = { ratio?: never; startAt?: Start };
type RatioProps = Controlled | Uncontrolled;

type Props = {
  onResized?: (ratio: number) => void;
  orientation?: "horizontal" | "vertical";
  parts?: {
    separator?: React.ComponentPropsWithRef<"div">;
    controls?: {
      container?: React.ComponentPropsWithRef<"span">;
      primary?: ButtonProps;
      secondary?: ButtonProps;
    };
  };
} & React.HTMLAttributes<HTMLDivElement> &
  RatioProps &
  BoundaryProps;

/**
 * Container that appends a separator when the children count equals 2.
 * It looks at HTML nodes, not React components
 */
export const Splitter = React.forwardRef<HTMLDivElement, Props>(
  (props = {}, ref) => {
    const {
      parts,
      ratio,
      onResized,
      min,
      max,
      children,
      orientation = "vertical",
      startAt,
      ...rest
    } = props;

    return (
      <div ref={ref} {...rest} className={clsx("Splitter", rest?.className)}>
        {children}
        <Separator
          {...parts?.separator}
          tabIndex={0}
          data-minpx={typeof min === "string" ? min : undefined}
          data-maxpx={typeof max === "string" ? max : undefined}
          aria-valuemin={typeof min === "number" ? Math.max(min, 0) : 0}
          aria-valuemax={typeof max === "number" ? Math.min(max, 100) : 100}
          role="separator"
          aria-orientation={orientation}
          ratio={ratio}
          onResized={onResized}
          parts={parts?.controls}
          startAt={mapStartAt({ ratio, startAt })}
          {...setDataBoundary({ min, max })}
        />
      </div>
    );
  },
);

Splitter.displayName = "Splitter";

const mapStartAt = (
  props: Pick<Props, "ratio" | "startAt">,
): number | undefined => {
  if (typeof props.ratio === "number") {
    // Only consider startAt value when Splitter is uncontrolled (ratio is undefined)
    return undefined;
  }
  // Words describe better intent than numbers.
  // However, 0 & 100 are figurative numbers.
  // If there are boundaries, these will be respected.
  switch (props.startAt) {
    case "1st-collapsed":
      return 0;
    case "2nd-collapsed":
      return 100;
    default:
      // Can be started at any other number between 0 and 100.
      return props.startAt ?? 50;
  }
};
