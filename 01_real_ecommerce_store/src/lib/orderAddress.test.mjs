import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeShippingAddress } from './orderAddress.js';

test('normalizeShippingAddress keeps province as the shipping value and removes postal code', () => {
  const normalized = normalizeShippingAddress({
    fullName: 'Ali Khan',
    phone: '03001234567',
    address: 'Main Street',
    city: 'Lahore',
    province: 'Punjab',
    country: 'Pakistan',
    postalCode: '54000',
  });

  assert.equal(normalized.province, 'Punjab');
  assert.equal(normalized.country, 'Punjab');
  assert.equal(normalized.postalCode, '');
});

test('normalizeShippingAddress accepts legacy Province and country fallback values', () => {
  const normalized = normalizeShippingAddress({
    fullName: 'Ali Khan',
    phone: '03001234567',
    address: 'Main Street',
    city: 'Lahore',
    Province: 'Sindh',
    country: 'Pakistan',
  });

  assert.equal(normalized.province, 'Sindh');
  assert.equal(normalized.country, 'Sindh');
  assert.equal(normalized.postalCode, '');
});
