import { clsx } from "./clsx";

describe("clsx", () => {
  it("trims and removes falsies and duplicates", () => {
    expect(clsx(" abc", "xyz", false, null, undefined, "abc ", "123")).toBe(
      "abc xyz 123",
    );
  });
});
