import { getKeyDownDeltaMove } from "./getKeyDownDeltaMove";

type Event = Parameters<typeof getKeyDownDeltaMove>[0];

const event = ({
  splitterWidth = 100,
  ...rest
}: Partial<Event> & { splitterWidth?: number }) => {
  return {
    currentTarget: {
      getAttribute: () => undefined,
      parentElement: {
        getBoundingClientRect: () => ({ width: splitterWidth }),
      },
    },
    ...rest,
  } as unknown as Event;
};

describe("getKeyDownDeltaMove", () => {
  it("increases/decreases by 1px, represented in % relative to splitter width", () => {
    const valueNow = 20;
    expect(
      getKeyDownDeltaMove(
        event({ key: "ArrowRight", splitterWidth: 200 }),
        valueNow,
      ),
    ).toBe(0.5);
    expect(
      getKeyDownDeltaMove(
        event({ key: "ArrowLeft", splitterWidth: 200 }),
        valueNow,
      ),
    ).toBe(-0.5);
    expect(
      getKeyDownDeltaMove(
        event({ key: "ArrowRight", splitterWidth: 100 }),
        valueNow,
      ),
    ).toBe(1);
    expect(
      getKeyDownDeltaMove(
        event({ key: "ArrowLeft", splitterWidth: 100 }),
        valueNow,
      ),
    ).toBe(-1);
    expect(
      getKeyDownDeltaMove(
        event({ key: "ArrowRight", splitterWidth: 50 }),
        valueNow,
      ),
    ).toBe(2);
    expect(
      getKeyDownDeltaMove(
        event({ key: "ArrowLeft", splitterWidth: 50 }),
        valueNow,
      ),
    ).toBe(-2);
  });
  it("increases/decreases by 10% when special keys are also pressed", () => {
    const specialKeys = ["ctrlKey", "shiftKey", "metaKey", "altKey"];
    const valueNow = 20;
    specialKeys.forEach((specialKey) => {
      expect(
        getKeyDownDeltaMove(
          event({ key: "ArrowLeft", [specialKey]: true }),
          valueNow,
        ),
      ).toBe(-10);
      expect(
        getKeyDownDeltaMove(
          event({ key: "ArrowRight", [specialKey]: true }),
          valueNow,
        ),
      ).toBe(10);
    });
  });
  it("increases/decreases by remaining % for Home & End keys", () => {
    expect(
      getKeyDownDeltaMove(event({ key: "Home", splitterWidth: 400 }), 20),
    ).toBe(-20);
    expect(
      getKeyDownDeltaMove(event({ key: "End", splitterWidth: 400 }), 30),
    ).toBe(70);
  });
});
