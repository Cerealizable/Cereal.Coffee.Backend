export function calculateCost(price, quantity) {
    // magic number of 100 to displace decimals to pennies
    return price * quantity * 100;
  }