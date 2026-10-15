import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateNextCartQuantity } from './cartQuantity.mjs';

test('increments quantity when adding stock-safe items', () => {
  assert.equal(calculateNextCartQuantity({ currentQuantity: 2, delta: 1, stock: 10 }), 3);
});

test('decrements quantity and removes when it reaches zero', () => {
  assert.equal(calculateNextCartQuantity({ currentQuantity: 1, delta: -1, stock: 10 }), 0);
});

test('caps quantity at available stock', () => {
  assert.equal(calculateNextCartQuantity({ currentQuantity: 5, delta: 10, stock: 7 }), 7);
});

test('handles invalid or zero delta safely', () => {
  assert.equal(calculateNextCartQuantity({ currentQuantity: 4, delta: 0, stock: 10 }), 4);
  assert.equal(calculateNextCartQuantity({ currentQuantity: 0, delta: 0, stock: 10 }), 0);
});
