import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Splitter } from "./Splitter";

const meta = {
  title: "Splitter",
  component: Splitter,
  tags: ["autodocs"],
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

function Default(args: Story["args"]) {
  return (
    <Splitter {...args}>
      <section />
      <section />
    </Splitter>
  );
}

export const Vertical: Story = {
  render: Default,
};

export const Horizontal: Story = {
  render: Default,
  args: { horizontal: true },
};

export const BoundariesFixed: Story = {
  render: Default,
  args: { min: "100px", max: "-100px", startAt: "2nd-collapsed" },
};

export const BoundariesRelative: Story = {
  render: Default,
  args: { min: 20, max: 80, startAt: "1st-collapsed" },
};

export const Navbar: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: { min: "100px", max: "300px" },
  render: function Render(args) {
    const min = parseInt(args.min as string);
    const [ratio, setRatio] = React.useState(0);
    const [state, setState] = React.useState("");
    const [resizing, setResizing] = React.useState(false);
    const navRef = React.useRef<HTMLDivElement>(null);
    const getNavWidth = () => navRef.current?.getBoundingClientRect().width;

    return (
      <Splitter
        {...args}
        onMouseDown={({ target }) => {
          if ((target as HTMLElement).role === "separator") {
            setState("manual");
            setResizing(true);
          }
        }}
        onMouseUp={() => resizing && setResizing(false)}
        parts={{
          separator: {
            style: { zIndex: 1 },
            onTransitionEnd: () => {
              if (state === "manual" && getNavWidth() === min && !resizing) {
                setState("");
              }
            },
          },
          controls: {
            secondary: { onClick: () => setState("manual") },
          },
        }}
        ratio={ratio}
        onRatioChanged={setRatio}
      >
        <div
          data-name="Navbar"
          ref={navRef}
          style={{ background: "#f4f4f4", zIndex: 1 }}
          onMouseOver={() => {
            if (state === "manual") return;
            if (state !== "hovered") setRatio(100);
            setState("hovered");
          }}
        />
        <div
          data-name="Page-content"
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
                  marginLeft: `0px`,
                }
              : {
                  position: "absolute",
                  marginLeft: `${min + 4}px`,
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
};
