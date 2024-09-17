import { clampSeparator } from "./clampSeparator";

describe("Clamps the separator valueNow", () => {
  it("delimits the value as per min/max default values", () => {
    expect(clampSeparator({ value: 1234 })).toBe(100);
    expect(clampSeparator({ value: -1234 })).toBe(0);
  });
  it("delimits the value as per min/max supplied values", () => {
    expect(clampSeparator({ value: -1234, min: 20 })).toBe(20);
    expect(clampSeparator({ value: 1234, max: 80 })).toBe(80);
  });
  it("does not allow min/max supplied values to go over 0-100 marks", () => {
    expect(clampSeparator({ value: -1234, min: -20 })).toBe(0);
    expect(clampSeparator({ value: 1234, max: 180 })).toBe(100);
    expect(clampSeparator({ value: -1234, min: NaN })).toBe(0);
    expect(clampSeparator({ value: 1234, max: NaN })).toBe(100);
  });
  it("keeps the value if within limits", () => {
    expect(clampSeparator({ value: 28, min: 20, max: 40 })).toBe(28);
    expect(clampSeparator({ value: 10, min: 20, max: 40 })).toBe(20);
    expect(clampSeparator({ value: 80, min: 20, max: 40 })).toBe(40);
  });
});
