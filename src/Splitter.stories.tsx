import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Splitter } from "./Splitter";

const meta = {
  title: "Example/Splitter",
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

const fullscreen = (story: Story): Story => ({
  ...story,
  parameters: {
    ...story?.parameters,
    layout: "fullscreen",
  },
  args: {
    ...story?.args,
    style: {
      ...story?.args?.style,
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    },
  },
});

export const Vertical: Story = fullscreen(initial());

export const Horizontal: Story = fullscreen(
  initial({ args: { orientation: "horizontal" } }),
);
