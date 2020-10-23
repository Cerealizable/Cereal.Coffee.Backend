import { calculateCost } from "../libs/billing-lib";

test("Lowest tier", () => {
  const price = 10;
  const quantity = 2;

  const cost = 2000;
  const expectedCost = calculateCost(price, quantity);

  expect(cost).toEqual(expectedCost);
});

test("Middle tier", () => {
  const price = 100;
  const quantity = 10;

  const cost = 100000
  const expectedCost = calculateCost(price, quantity);

  expect(cost).toEqual(expectedCost);
});

test("Highest tier", () => {
  const price = 101;
  const quantity = 25;

  const cost = 252500;
  const expectedCost = calculateCost(price, quantity);

  expect(cost).toEqual(expectedCost);
});