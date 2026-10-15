import test from 'node:test';
import assert from 'node:assert/strict';

import {
  OTP_MAX_ATTEMPTS,
  normalizeEmail,
  isOtpExpired,
  evaluateOtpVerification,
} from './otpVerification.js';

test('normalizeEmail lowercases and trims incoming email values', () => {
  assert.equal(normalizeEmail('  USER@EXAMPLE.COM  '), 'user@example.com');
  assert.equal(normalizeEmail('user@example.com'), 'user@example.com');
});

test('already verified users are rejected with EMAIL_ALREADY_VERIFIED', () => {
  const state = evaluateOtpVerification({
    emailVerified: true,
    otpCode: '123456',
    submittedOtp: '123456',
    expiresAt: new Date(Date.now() + 60_000),
  });

  assert.equal(state.code, 'EMAIL_ALREADY_VERIFIED');
  assert.equal(state.status, 409);
  assert.equal(state.ok, false);
});

test('missing OTPs are rejected cleanly', () => {
  const state = evaluateOtpVerification({
    emailVerified: false,
    otpCode: null,
    submittedOtp: '123456',
    expiresAt: new Date(Date.now() + 60_000),
  });

  assert.equal(state.code, 'OTP_NOT_FOUND');
  assert.equal(state.status, 400);
  assert.equal(state.ok, false);
});

test('expired OTPs return OTP_EXPIRED', () => {
  const state = evaluateOtpVerification({
    emailVerified: false,
    otpCode: '123456',
    submittedOtp: '123456',
    expiresAt: new Date(Date.now() - 1_000),
  });

  assert.equal(state.code, 'OTP_EXPIRED');
  assert.equal(state.status, 400);
  assert.equal(state.ok, false);
});

test('reused OTPs after expiry are rejected as expired', () => {
  const state = evaluateOtpVerification({
    emailVerified: false,
    otpCode: '123456',
    submittedOtp: '123456',
    expiresAt: new Date(Date.now() - 10_000),
  });

  assert.equal(state.code, 'OTP_EXPIRED');
  assert.equal(state.ok, false);
});

test('invalid OTP attempts increment and eventually block new attempts', () => {
  const firstAttempt = evaluateOtpVerification({
    emailVerified: false,
    otpCode: '123456',
    submittedOtp: '654321',
    expiresAt: new Date(Date.now() + 60_000),
    otpAttempts: 3,
  });

  assert.equal(firstAttempt.code, 'INVALID_OTP');
  assert.equal(firstAttempt.status, 400);

  const limitReached = evaluateOtpVerification({
    emailVerified: false,
    otpCode: '123456',
    submittedOtp: '654321',
    expiresAt: new Date(Date.now() + 60_000),
    otpAttempts: OTP_MAX_ATTEMPTS - 1,
  });

  assert.equal(limitReached.code, 'OTP_ATTEMPT_LIMIT_EXCEEDED');
  assert.equal(limitReached.status, 429);
});

test('valid OTPs succeed and reset attempts', () => {
  const state = evaluateOtpVerification({
    emailVerified: false,
    otpCode: '123456',
    submittedOtp: '123456',
    expiresAt: new Date(Date.now() + 60_000),
    otpAttempts: 2,
  });

  assert.equal(state.ok, true);
  assert.equal(state.code, 'OTP_VERIFIED');
  assert.equal(state.status, 200);
});

test('isOtpExpired returns true when an OTP is already expired or missing', () => {
  assert.equal(isOtpExpired(null), true);
  assert.equal(isOtpExpired(new Date(Date.now() - 1_000)), true);
  assert.equal(isOtpExpired(new Date(Date.now() + 60_000)), false);
});
