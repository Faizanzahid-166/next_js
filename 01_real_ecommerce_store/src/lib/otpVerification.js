export const OTP_MAX_ATTEMPTS = 5;

export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export function isOtpExpired(expiresAt, now = Date.now()) {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() <= now;
}

export function evaluateOtpVerification({
  emailVerified,
  otpCode,
  submittedOtp,
  expiresAt,
  otpAttempts = 0,
  now = Date.now(),
  maxAttempts = OTP_MAX_ATTEMPTS,
}) {
  if (emailVerified) {
    return {
      ok: false,
      code: "EMAIL_ALREADY_VERIFIED",
      status: 409,
      message: "This email has already been verified.",
    };
  }

  if (!otpCode) {
    return {
      ok: false,
      code: "OTP_NOT_FOUND",
      status: 400,
      message: "Verification code is missing or expired. Please request a new one.",
    };
  }

  if (isOtpExpired(expiresAt, now)) {
    return {
      ok: false,
      code: "OTP_EXPIRED",
      status: 400,
      message: "OTP expired. Please request a new one.",
    };
  }

  const attemptCount = Number(otpAttempts || 0);
  const nextAttempts = attemptCount + 1;

  if (attemptCount >= maxAttempts) {
    return {
      ok: false,
      code: "OTP_ATTEMPT_LIMIT_EXCEEDED",
      status: 429,
      message: "Too many invalid OTP attempts. Please request a new code.",
    };
  }

  const safeSubmittedOtp = String(submittedOtp ?? "").trim();
  const validOtp = String(otpCode ?? "").trim();

  if (!safeSubmittedOtp || safeSubmittedOtp !== validOtp) {
    return {
      ok: false,
      code: nextAttempts >= maxAttempts ? "OTP_ATTEMPT_LIMIT_EXCEEDED" : "INVALID_OTP",
      status: nextAttempts >= maxAttempts ? 429 : 400,
      message:
        nextAttempts >= maxAttempts
          ? "Too many invalid OTP attempts. Please request a new code."
          : "Invalid OTP.",
      nextAttempts,
      limitReached: nextAttempts >= maxAttempts,
    };
  }

  return {
    ok: true,
    code: "OTP_VERIFIED",
    status: 200,
    nextAttempts: 0,
  };
}
