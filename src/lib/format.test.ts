import { describe, expect, it } from "vitest";
import { formatPrice, formatRating, PRICE_LEVEL_LABEL } from "./format";

describe("formatPrice", () => {
  it("formats an integer amount as KZT without decimals", () => {
    expect(formatPrice(3800)).toContain("3");
    expect(formatPrice(3800)).toContain("800");
    expect(formatPrice(3800)).not.toContain(",00");
  });
});

describe("formatRating", () => {
  it("keeps one decimal place", () => {
    expect(formatRating(4.8)).toBe("4.8");
    expect(formatRating(4)).toBe("4.0");
  });
});

describe("PRICE_LEVEL_LABEL", () => {
  it("maps price levels to $ signs", () => {
    expect(PRICE_LEVEL_LABEL[1]).toBe("$");
    expect(PRICE_LEVEL_LABEL[2]).toBe("$$");
    expect(PRICE_LEVEL_LABEL[3]).toBe("$$$");
  });
});
