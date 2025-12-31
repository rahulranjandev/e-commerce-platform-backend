import { jest } from '@jest/globals';

import {
  azureUploadMocks,
  checkAndGenerateEmbeddingsMock,
  generateVectorsMock,
  jwtMock,
  orderServiceMock,
  paymentServiceMock,
  productServiceMock,
  resetAllMocks,
  reviewServiceMock,
  sendEmailMock,
  uploadAnyMock,
  userServiceMock,
  vectorSearchServiceMock,
} from './mocks/services';

jest.mock('@interfaces/IUser', () => ({ UserService: jest.fn(() => userServiceMock) }));

jest.mock('@interfaces/IProduct', () => ({ ProductService: jest.fn(() => productServiceMock) }));

jest.mock('@interfaces/IReview', () => ({ ReviewService: jest.fn(() => reviewServiceMock) }));

jest.mock('@interfaces/IOrder', () => ({ OrderService: jest.fn(() => orderServiceMock) }));

jest.mock('@utils/razorpay', () => ({ PaymentService: jest.fn(() => paymentServiceMock) }));

jest.mock('@utils/sendEmail', () => ({ SendEmail: jest.fn(() => sendEmailMock) }));

jest.mock('@utils/azureUpload', () => azureUploadMocks);

jest.mock('@utils/generateEmbeddings', () => ({
  checkAndGenerateEmbeddings: checkAndGenerateEmbeddingsMock,
  generate_vectors: generateVectorsMock,
}));

jest.mock('@utils/jwt', () => ({
  signedToken: jwtMock.signedToken,
  verifyToken: jwtMock.verifyToken,
  cookieOptions: { httpOnly: true, sameSite: 'lax', secure: false },
}));

jest.mock('@utils/upload', () => ({ __esModule: true, default: { any: uploadAnyMock } }));

jest.mock('@utils/connectDB', () => ({ connectDB: jest.fn() }));

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(async () => 'salt'),
  hash: jest.fn(async (value: string) => `hashed-${value}`),
  compare: jest.fn(async () => true),
}));

jest.mock('node-cron', () => ({ schedule: jest.fn() }));

jest.mock('@interfaces/IVectorSearch', () => ({ VectorSearchService: jest.fn(() => vectorSearchServiceMock) }));

beforeEach(() => {
  resetAllMocks();
});
