import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Splitter } from "./Splitter";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("Splitter", () => {
  it("defaults to 50-50", async () => {
    render(
      <Splitter>
        <section>1</section>
        <section>2</section>
      </Splitter>,
    );
    const slider = screen.getByRole("separator");
    await waitFor(() => {
      expect(slider.getAttribute("aria-valuenow")).toBe("50");
      expect(slider.getAttribute("aria-valuemax")).toBe("100");
      expect(slider.getAttribute("aria-valuemin")).toBe("0");
    });
  });
  it("moves the slider until click is released", async () => {
    render(
      <Splitter style={{ width: 100 }}>
        <section>1</section>
        <section>2</section>
      </Splitter>,
    );
    const slider = screen.getByRole("separator");
    fireEvent.mouseDown(slider);
    fireEvent.mouseMove(window, { clientX: 10 });

    await waitFor(() =>
      expect(slider.getAttribute("aria-valuenow")).toBe("10"),
    );

    // It stops resizing after mouse up
    fireEvent.click(slider);
    fireEvent.mouseMove(window, { clientX: 9999 });
    await waitFor(() =>
      expect(slider.getAttribute("aria-valuenow")).toBe("10"),
    );
  });
  it("moves the until the ratio limit", async () => {
    render(
      <Splitter style={{ width: 100, marginLeft: 50 }} min={25} max={75}>
        <section>1</section>
        <section>2</section>
      </Splitter>,
    );
    const slider = screen.getByRole("separator");

    expect(slider.getAttribute("aria-valuemin")).toBe("25");
    expect(slider.getAttribute("aria-valuemax")).toBe("75");

    fireEvent.mouseDown(slider);
    fireEvent.mouseMove(window, { clientX: 0 });
    await waitFor(() =>
      expect(slider.getAttribute("aria-valuenow")).toBe("25"),
    );

    fireEvent.mouseMove(window, { clientX: 999 });
    await waitFor(() =>
      expect(slider.getAttribute("aria-valuenow")).toBe("75"),
    );
  });
  it("broadcasts slide changes", async () => {
    const onRatioChange = jest.fn();
    render(
      <Splitter style={{ width: 100 }} ratio={25} onResized={onRatioChange}>
        <section>1</section>
        <section>2</section>
      </Splitter>,
    );
    // It broadcasts initial value on first render
    await waitFor(() => expect(onRatioChange).toBeCalledWith(25));

    const slider = screen.getByRole("separator");

    fireEvent.mouseDown(slider);
    fireEvent.mouseMove(window, { clientX: 10 });

    await waitFor(() => expect(onRatioChange).toBeCalledWith(10));

    // If mouse goes beyond boundaries, it broadcasts up to range limit
    fireEvent.mouseMove(window, { clientX: 999 });
    await waitFor(() => expect(onRatioChange).toBeCalledWith(100));

    expect(onRatioChange).toBeCalledTimes(3);
  });
});
