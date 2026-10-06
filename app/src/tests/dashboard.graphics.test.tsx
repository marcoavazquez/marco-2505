import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { BetsGraphics } from "../features/dashboard/components/BetsGraphics";
import { SnailsGraphic } from "../features/dashboard/components/SnailsGraphic";

const CHART_SIZE = 400;

beforeAll(() => {
  class ResizeObserverMock implements ResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}

    observe() {
      this.callback(
        [
          {
            contentRect: { width: CHART_SIZE, height: CHART_SIZE },
          } as unknown as ResizeObserverEntry,
        ],
        this,
      );
    }

    unobserve() {}

    disconnect() {}
  }

  globalThis.ResizeObserver = ResizeObserverMock;

  Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return {
      width: CHART_SIZE,
      height: CHART_SIZE,
      top: 0,
      left: 0,
      right: CHART_SIZE,
      bottom: CHART_SIZE,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect;
  };
});

const shapes = (container: HTMLElement, selector: string) =>
  Array.from(container.querySelectorAll(selector)).map((shape) => [
    shape.getAttribute("name"),
    shape.getAttribute("fill"),
  ]);

describe("BetsGraphics", () => {
  it("draws one coloured sector per bet outcome", () => {
    const { container } = render(<BetsGraphics />);

    expect(shapes(container, ".recharts-sector")).toEqual([
      ["Ganado", "#22c55e"],
      ["Perdido", "#ef4444"],
    ]);
  });
});

describe("SnailsGraphic", () => {
  it("draws a highlighted bar for each leading snail", () => {
    const { container } = render(<SnailsGraphic />);

    expect(shapes(container, ".recharts-rectangle")).toEqual([
      ["Gary", "#22c55e"],
      ["Rocky", "#d4d4d8"],
      ["Samantha", "#d4d4d8"],
      ["Estefanía", "#22c55e"],
    ]);
  });

  it("never falls back to the default sector grey", () => {
    const { container } = render(<SnailsGraphic />);

    expect(
      shapes(container, ".recharts-rectangle").map(([, fill]) => fill),
    ).not.toContain("#808080");
  });
});
