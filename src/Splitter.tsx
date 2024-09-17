import React, { useEffect } from "react";
import { clsx } from "./helpers/clsx";
import { setDataBoundary } from "./helpers/dataBoundary";
import { Separator } from "./Separator/Separator";

/**
 * Container that appends a separator when the children count equals 2.
 * It looks at HTML nodes, not React components
 */
export const Splitter = React.forwardRef<
  HTMLDivElement,
  {
    startAt?: number | "1st-collapsed" | "2nd-collapsed";
    ratio?: number;
    min?: number | `${number}px`;
    max?: number | `${number}px`;
    onResized?: (ratio: number) => void;
    horizontal?: true;
    parts?: {
      separator?: JSX.IntrinsicElements["div"];
      controls?: {
        container?: JSX.IntrinsicElements["span"];
        primary?: JSX.IntrinsicElements["button"];
        secondary?: JSX.IntrinsicElements["button"];
      };
    };
  } & JSX.IntrinsicElements["div"]
>((props = {}, ref) => {
  const {
    min: minProp,
    max: maxProp,
    startAt: startAtProp,
    parts,
    ratio,
    onResized,
    children,
    horizontal,
    ...rest
  } = props;

  const startAt = mapStartAt({ ratio, startAt: startAtProp });
  const boundaries = mapBoundaries({ min: minProp, max: maxProp });
  const { min, max } = boundaries ?? {};

  useEffect(() => {
    if (boundaries === undefined) {
      console.warn(
        `Boundaries in different units is not supported. Properties min={${minProp}} and max={${maxProp}} are omitted`,
      );
    }
  }, [boundaries]);

  useEffect(() => {
    if (startAt !== undefined && ratio !== undefined) {
      console.warn(
        `Property startAt and ratio are incompatible. Properties startAt={${startAt}} is omitted`,
      );
    }
  }, [ratio, startAt]);

  return (
    <div
      ref={ref}
      {...rest}
      className={clsx("react-splitter", rest?.className)}
    >
      {children}
      <Separator
        {...parts?.separator}
        role="separator"
        tabIndex={0}
        aria-orientation={horizontal ? "horizontal" : "vertical"}
        aria-valuemin={typeof min === "number" ? Math.max(min, 0) : 0}
        aria-valuemax={typeof max === "number" ? Math.min(max, 100) : 100}
        data-minpx={typeof min === "string" && min ? min : undefined}
        data-maxpx={typeof max === "string" && max ? max : undefined}
        parts={parts?.controls}
        {...{ ratio, onResized, startAt }}
        {...setDataBoundary({ min, max })}
      />
    </div>
  );
});

Splitter.displayName = "Splitter";

type Props = React.ComponentProps<typeof Splitter>;

const mapBoundaries = ({
  min,
  max,
}: {
  min?: number | `${number}px`;
  max?: number | `${number}px`;
}) => {
  const boundaryTypes = [typeof min, typeof max];
  if (boundaryTypes.includes("string") && boundaryTypes.includes("number"))
    return;
  return { min, max };
};

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
