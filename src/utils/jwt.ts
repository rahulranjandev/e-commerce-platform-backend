import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import {
  NODE_ENV,
  JWT_SECRET,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY,
} from '@config';

const accessTokenPrivateKey = ACCESS_TOKEN_PRIVATE_KEY as string;
const accessTokenPublicKey = ACCESS_TOKEN_PUBLIC_KEY as string;

const refreshTokenPrivateKey = REFRESH_TOKEN_PRIVATE_KEY as string;
const refreshTokenPublicKey = REFRESH_TOKEN_PUBLIC_KEY as string;

const jwtSecret = JWT_SECRET as string;

// Sign a token with the private key
const signedToken = (payload: Object) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
};

// Verify a token with the public key
const verifyToken = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, jwtSecret) as T;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// New Signed Token with Refresh Token
const newSignedToken = (
  payload: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined
) => {
  const actualKey = keyName === 'accessTokenPrivateKey' ? accessTokenPrivateKey : refreshTokenPrivateKey;
  const decodedKey = Buffer.from(actualKey, 'base64').toString('ascii');

  return jwt.sign(payload, decodedKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

// Verify a token with the public key
const verifyNewToken = <T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null => {
  try {
    const actualKey = keyName === 'accessTokenPublicKey' ? accessTokenPublicKey : refreshTokenPublicKey;
    const decodedKey = Buffer.from(actualKey, 'base64').toString('ascii');

    const verify = jwt.verify(token, decodedKey);

    return {
      vaild: true,
      expired: false,
      verify,
    } as T;
  } catch (err: any) {
    console.error(err);
    return {
      vaild: false,
      expired: err.name === 'TokenExpiredError',
      verify: null,
    } as T;
  }
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: NODE_ENV === 'production',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

const getCookieOptions = (expiresIn: string): CookieOptions => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: NODE_ENV === 'production',
  expires: new Date(Date.now() + expiresIn),
});

const createAccessToken = (payload: Object) => {
  return newSignedToken(payload, 'accessTokenPrivateKey', {
    expiresIn: '15m',
  });
};

const createRefreshToken = (payload: Object) => {
  return newSignedToken(payload, 'refreshTokenPrivateKey', {
    expiresIn: '7d',
  });
};

const verifyAccessToken = <T>(token: string): T | null => {
  return verifyNewToken<T>(token, 'accessTokenPublicKey');
};

const verifyRefreshToken = <T>(token: string): T | null => {
  return verifyNewToken<T>(token, 'refreshTokenPublicKey');
};

const setAccessTokenCookie = (accessToken: string, res: any) => {
  const options = getCookieOptions('15m');
  res.cookie('access_token', accessToken, options);
};

const setRefreshTokenCookie = (refreshToken: string, res: any) => {
  const options = getCookieOptions('7d');
  res.cookie('refresh_token', refreshToken, options);
};

const removeAccessTokenCookie = (res: any) => {
  const options = getCookieOptions('-1s');
  res.cookie('access_token', '', options);
};

const removeRefreshTokenCookie = (res: any) => {
  const options = getCookieOptions('-1s');
  res.cookie('refresh_token', '', options);
};

export {
  signedToken,
  verifyToken,
  newSignedToken,
  verifyNewToken,
  getCookieOptions,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  removeAccessTokenCookie,
  removeRefreshTokenCookie,
  cookieOptions,
};
