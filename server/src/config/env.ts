import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Look for .env in current directory, server directory, and parent paths
const potentialEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../server/.env')
];

for (const envPath of potentialEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

const keyId = process.env.RAZORPAY_KEY_ID || process.env.LIVE_API_KEY || 'rzp_live_TdWOOe8pJsTv4a';
const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.LIVE_SECRET_KEY || 'AMX36S7ivlSsiQgzn2JZOEXj';

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'conceptifyyy_super_secure_jwt_token_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Real Razorpay Configuration
  razorpay: {
    keyId,
    keySecret,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    isConfigured: Boolean(
      keyId && 
      keySecret &&
      !keyId.includes('placeholder') &&
      !keyId.includes('demo') &&
      keyId.startsWith('rzp_')
    )
  }
};
