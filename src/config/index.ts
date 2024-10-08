import { config } from 'dotenv';

const PATH = '.env';

if (!PATH) {
  throw new Error('The .env file is missing');
}

config({ path: PATH });

export const {
  HOST_URL,
  NODE_ENV,
  PORT,
  MONGODB_URL,
  JWT_SECRET,
  AZURE_STORAGE_CONNECTION_STRING,
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_KEY,
  BLOB_CONTAINER_NAME,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  FROM_SUPPORT_EMAIL,
  FROM_SENDER_EMAIL,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  SUPPORT_EMAIL,
  LOGO_URL,
} = process.env;

if (!HOST_URL) {
  throw new Error('HOST_URL is missing');
}

if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is missing');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}

if (!ACCESS_TOKEN_PRIVATE_KEY) {
  throw new Error('ACCESS_TOKEN_PRIVATE_KEY is missing');
}

if (!ACCESS_TOKEN_PUBLIC_KEY) {
  throw new Error('ACCESS_TOKEN_PUBLIC_KEY is missing');
}

if (!REFRESH_TOKEN_PRIVATE_KEY) {
  throw new Error('REFRESH_TOKEN_PRIVATE_KEY is missing');
}

if (!REFRESH_TOKEN_PUBLIC_KEY) {
  throw new Error('REFRESH_TOKEN_PUBLIC_KEY is missing');
}

if (!MAILGUN_API_KEY) {
  throw new Error('MAILGUN_API_KEY is missing');
}

if (!MAILGUN_DOMAIN) {
  throw new Error('MAILGUN_DOMAIN is missing');
}

if (!FROM_SUPPORT_EMAIL) {
  throw new Error('FROM_SUPPORT_EMAIL is missing');
}

if (!FROM_SENDER_EMAIL) {
  throw new Error('FROM_SENDER_EMAIL is missing');
}

if (!SUPPORT_EMAIL) {
  throw new Error('SUPPORT_EMAIL is missing');
}

if (!LOGO_URL) {
  throw new Error('LOGO_URL is missing');
}

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('AZURE_STORAGE_CONNECTION_STRING is missing');
}

if (!BLOB_CONTAINER_NAME) {
  throw new Error('BLOB_CONTAINER_NAME is missing');
}

if (!RAZORPAY_KEY_ID) {
  throw new Error('RAZORPAY_KEY_ID is missing');
}

if (!RAZORPAY_KEY_SECRET) {
  throw new Error('RAZORPAY_KEY_SECRET is missing');
}
