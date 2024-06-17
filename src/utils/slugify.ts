import { randomBytes } from 'crypto';

const getRandomBytes = (bytes: number = 2, format: 'hex' | 'base64' = 'hex'): string => {
  const buffer = randomBytes(bytes);
  let randomString: string;

  if (format === 'hex') {
    randomString = buffer.toString('hex');
  } else if (format === 'base64') {
    randomString = buffer.toString('base64').replace(/[+/=]/g, '');
  } else {
    throw new Error("Invalid format. Use 'hex' or 'base64'.");
  }

  // Ensure the string length is within 6 to 10 characters
  const minLength = 6;
  const maxLength = 10;

  if (randomString.length < minLength) {
    return randomString.padEnd(minLength, '0').slice(0, maxLength);
  }

  return randomString.slice(0, maxLength);
};

export default getRandomBytes;
