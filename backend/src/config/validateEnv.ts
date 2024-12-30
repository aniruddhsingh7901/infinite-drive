// src/config/validateEnv.ts
interface EnvVars {
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    COINBASE_API_KEY: string;
    COINBASE_WEBHOOK_SECRET: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET_KEY: string;
    AWS_BUCKET_NAME: string;
    AWS_REGION: string;
    EMAIL_SERVICE: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    FRONTEND_URL: string;
  }
  
  export const validateEnv = (): EnvVars => {
    const requiredEnvVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'COINBASE_API_KEY',
      'COINBASE_WEBHOOK_SECRET',
      'AWS_ACCESS_KEY',
      'AWS_SECRET_KEY',
      'AWS_BUCKET_NAME',
      'AWS_REGION',
      'EMAIL_SERVICE',
      'EMAIL_USER',
      'EMAIL_PASS',
      'FRONTEND_URL'
    ];
  
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }
  
    return {
      PORT: parseInt(process.env.PORT || '5000'),
      MONGODB_URI: process.env.MONGODB_URI!,
      JWT_SECRET: process.env.JWT_SECRET!,
      COINBASE_API_KEY: process.env.COINBASE_API_KEY!,
      COINBASE_WEBHOOK_SECRET: process.env.COINBASE_WEBHOOK_SECRET!,
      AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY!,
      AWS_SECRET_KEY: process.env.AWS_SECRET_KEY!,
      AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME!,
      AWS_REGION: process.env.AWS_REGION!,
      EMAIL_SERVICE: process.env.EMAIL_SERVICE!,
      EMAIL_USER: process.env.EMAIL_USER!,
      EMAIL_PASS: process.env.EMAIL_PASS!,
      FRONTEND_URL: process.env.FRONTEND_URL!
    };
  };