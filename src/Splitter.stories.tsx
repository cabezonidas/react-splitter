import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Splitter } from "./Splitter";

const meta = {
  title: "Splitter",
  component: Splitter,
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

const initial = (story?: Story): Story => ({
  ...story,
  args: {
    ...story?.args,
    children: story?.args?.children ?? (
      <React.Fragment>
        <section />
        <section />
      </React.Fragment>
    ),
  },
});

const fullscreen = (
  story: Story,
  config?: { storyPadding?: boolean },
): Story => {
  const padding = config?.storyPadding ?? true;
  return {
    ...story,
    parameters: {
      ...story?.parameters,
      ...(padding ? {} : { layout: "fullscreen" }),
    },
    args: {
      ...story?.args,
      style: {
        ...story?.args?.style,
        position: "absolute",
        ...(padding
          ? { width: "calc(100vw - 2rem)", height: "calc(100vh - 2rem)" }
          : { width: "100vw", height: "100vh" }),
      },
    },
  };
};

export const Vertical: Story = fullscreen(initial());

export const Horizontal: Story = fullscreen(
  initial({ args: { horizontal: true } }),
);

export const BoundariesFixed: Story = fullscreen(
  initial({ args: { min: "100px", max: "-100px", startAt: "1st-collapsed" } }),
);

export const BoundariesRelative: Story = fullscreen(
  initial({ args: { min: 20, max: 80, startAt: "1st-collapsed" } }),
);

export const Navbar: Story = fullscreen(
  initial({
    render: function Render(args) {
      const [ratio, setRatio] = React.useState(0);
      const [state, setState] = React.useState("");
      const [resizing, setResizing] = React.useState(false);
      const navRef = React.useRef<HTMLDivElement>(null);

      return (
        <Splitter
          style={args.style}
          min="50px"
          max="150px"
          onMouseDown={(e) => {
            const el = e.target as HTMLElement;
            if (el.role === "separator") {
              setState("manual");
              setResizing(true);
            }
          }}
          onMouseUp={() => {
            if (resizing) {
              setResizing(false);
            }
          }}
          parts={{
            separator: {
              style: { zIndex: 1 },
              onTransitionEnd: () => {
                const primaryWidth =
                  navRef.current?.getBoundingClientRect().width;
                if (
                  state === "manual" &&
                  `${primaryWidth}px` === "50px" &&
                  !resizing
                ) {
                  setState("");
                }
              },
            },
            controls: {
              secondary: { onClick: () => setState("manual") },
            },
          }}
          ratio={ratio}
          onResized={setRatio}
        >
          <div
            ref={navRef}
            style={{ background: "#f4f4f4", zIndex: 1 }}
            onMouseOver={() => {
              if (state === "manual") return;
              if (state !== "hovered") setRatio(100);
              setState("hovered");
            }}
          />
          <div
            onMouseOver={() => {
              if (state === "hovered") {
                setRatio(0);
                setState("");
              }
            }}
            style={{
              ...(state === "manual"
                ? {
                    position: "relative",
                    marginLeft: "0px",
                  }
                : {
                    position: "absolute",
                    marginLeft: "54px",
                  }),
              paddingLeft: "10px",
              width: "100%",
              height: "100%",
            }}
          >
            <h1>Navbar</h1>
          </div>
        </Splitter>
      );
    },
  }),
  { storyPadding: false },
);
