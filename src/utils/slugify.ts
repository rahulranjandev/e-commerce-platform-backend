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

// Function to sanitize filenames and preserve file extensions
export const sanitizeFilename = (filename: string): string => {
  // Split the filename into name and extension parts
  const parts = filename.split('.');
  const name = parts.slice(0, -1).join('.'); // Get the name without the extension
  const extension = parts.length > 1 ? parts[parts.length - 1] : ''; // Get the extension if it exists

  // Sanitize the name part
  const sanitizedBaseName = name
    .replace(/[^a-zA-Z0-9]/g, '_') // Replace special characters with underscores
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toLowerCase(); // Convert to lowercase

  // Return the sanitized name with the original extension
  return extension ? `${sanitizedBaseName}.${extension}` : sanitizedBaseName;
};

export default getRandomBytes;
