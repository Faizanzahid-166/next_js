import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateDeliveryCharge, calculateCartSummary } from './deliveryCharge.mjs';

test('single unique product costs Rs. 250 regardless of quantity', () => {
  assert.equal(calculateDeliveryCharge([{ productId: 'p1', quantity: 1 }]), 250);
  assert.equal(calculateDeliveryCharge([{ productId: 'p1', quantity: 5 }]), 250);
  assert.equal(calculateDeliveryCharge([{ productId: 'p1', quantity: 2 }, { productId: 'p1', quantity: 3 }]), 250);
});

test('two unique products cost Rs. 360', () => {
  assert.equal(calculateDeliveryCharge([{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 1 }]), 360);
  assert.equal(calculateDeliveryCharge([{ productId: 'p1', quantity: 1 }, { productId: 'p2', quantity: 5 }]), 360);
});

test('three unique products cost Rs. 420', () => {
  assert.equal(calculateDeliveryCharge([{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 1 }, { productId: 'p3', quantity: 1 }]), 420);
});

test('four unique products cost Rs. 480 and five cost Rs. 540', () => {
  assert.equal(calculateDeliveryCharge([{ productId: 'p1' }, { productId: 'p2' }, { productId: 'p3' }, { productId: 'p4' }]), 480);
  assert.equal(calculateDeliveryCharge([{ productId: 'p1' }, { productId: 'p2' }, { productId: 'p3' }, { productId: 'p4' }, { productId: 'p5' }]), 540);
});

test('extra quantities do not add delivery cost', () => {
  const summary = calculateCartSummary([
    { productId: 'p1', price: 1000, quantity: 5 },
    { productId: 'p2', price: 700, quantity: 3 },
    { productId: 'p3', price: 900, quantity: 1 },
  ]);

  assert.equal(summary.uniqueProductsCount, 3);
  assert.equal(summary.deliveryCharge, 420);
  assert.equal(summary.grandTotal, 1000 * 5 + 700 * 3 + 900 + 420);
});

test('removing products and empty cart recalc to zero', () => {
  assert.equal(calculateDeliveryCharge([]), 0);
  assert.equal(calculateDeliveryCharge([{ productId: 'p1' }, { productId: 'p2' }]), 360);
  assert.equal(calculateDeliveryCharge([{ productId: 'p1' }]), 250);
});
