/**
 * Environment configuration loader
 * Validates and exports all required environment variables
 */

const dns = require('dns')

// Load env vars from .env.local in development
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['1.1.1.1', '8.8.8.8'])
  console.log('🌐 DNS override enabled (dev only)')

  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (err) {
    console.warn('dotenv not available, using system env vars');
  }
}

// Required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
];

// Validate required vars
const missing = requiredEnvVars.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `\n❌ Missing environment variables: ${missing.join(', ')}\n` +
    'Please check your .env.local file.\n'
  );
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

// Export configuration object
const config = {
  // Database
  mongoUri: process.env.MONGO_URI,

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // OTP
  otpExpiresMin: parseInt(process.env.OTP_EXPIRES_MIN || '10', 10),

  // Node environment
  nodeEnv: process.env.NODE_ENV || 'development',

  // Email
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  testEmail: process.env.TEST_EMAIL,

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,

  // Admin
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL,
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,

  // URLs
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  nextPublicAppDomain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://localhost:3000',

  // Helpers
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Validate MongoDB URI format
if (config.mongoUri && !config.mongoUri.startsWith('mongodb')) {
  console.error('❌ Invalid MONGO_URI format. Must start with "mongodb" or "mongodb+srv"');
  if (config.isProduction) {
    throw new Error('Invalid MONGO_URI');
  }
}

// Log loaded config in development (safe values only)
if (config.isDevelopment) {
  console.log('✅ Environment config loaded:');
  console.log(`   - Node Env: ${config.nodeEnv}`);
  console.log(`   - MongoDB: ${config.mongoUri ? '✓' : '✗'}`);
  console.log(`   - JWT Secret: ${config.jwtSecret ? '✓' : '✗'}`);
  console.log(`   - Supabase: ${config.supabaseUrl ? '✓' : '✗'}`);
  console.log(`   - Resend API: ${config.resendApiKey ? '✓' : '✗'}`);
}

module.exports = config;
