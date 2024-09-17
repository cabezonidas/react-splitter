import React from "react";
import { getSeparatorAttributes } from "../helpers/getSeparatorAttributes";

export const useControlIcon = ({
  control,
  side,
}: {
  control: React.RefObject<HTMLButtonElement>;
  side: "primary" | "secondary";
}) => {
  const [attributes, setAttributes] = React.useState<{
    alt: string;
    icon: `${"single" | "double"}_arrow_${"left" | "right" | "up" | "down"}`;
  }>();

  React.useEffect(() => {
    const separator = control.current?.closest('[role="separator"]');
    const callback = () => setAttributes(getIconAndText(side, separator));
    callback();
    const observer = new MutationObserver(callback);
    observer.observe(separator!, { attributeFilter: ["aria-valuenow"] });
    return () => observer.disconnect();
  }, [parent, side]);

  return attributes;
};

type IconType = NonNullable<ReturnType<typeof useControlIcon>>["icon"];

const getIconAndText = (
  side: "primary" | "secondary",
  separator?: Element | null,
): { alt: string; icon: IconType } | undefined => {
  const { valueNow, orientation } = getSeparatorAttributes({ separator });

  if (valueNow === undefined) return;

  return side === "primary"
    ? builder({
        type: valueNow === 100 ? "single" : "double",
        arrow: orientation === "vertical" ? "left" : "up",
        side,
      })
    : builder({
        type: valueNow === 0 ? "single" : "double",
        arrow: orientation === "vertical" ? "right" : "down",
        side,
      });
};

const builder = ({
  type,
  side,
  arrow,
}: {
  type: "single" | "double";
  side: "primary" | "secondary";
  arrow: "up" | "down" | "right" | "left";
}): { alt: string; icon: IconType } => ({
  icon: `${type}_arrow_${arrow}`,
  alt: type === "double" ? `Collapse ${side} panel` : `Restore ${side} panel`,
});
