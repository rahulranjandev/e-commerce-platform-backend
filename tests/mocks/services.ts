// @ts-nocheck
import { jest } from '@jest/globals';

const mk = () => jest.fn() as jest.Mock;

export const defaultUser = {
  _id: 'user-id',
  id: 'user-id',
  email: 'user@example.com',
  password: 'hashed-password',
  isAdmin: true,
  admin: true,
  verified: true,
  token: '',
};

export const userServiceMock = {
  getUserByQuery: mk(),
  createUser: mk(),
  getUserByEmail: mk(),
  getUserByToken: mk(),
  findAndUpdateUser: mk(),
  resetPassword: mk(),
  getUserById: mk(),
  deleteUser: mk(),
};

export const productServiceMock = {
  getProductsWithoutDescription: mk(),
  getProductByCategory: mk(),
  getProductById: mk(),
  getProductByQuery: mk(),
  createProduct: mk(),
  updateProduct: mk(),
  deleteProduct: mk(),
  findAndUpdateProduct: mk(),
};

export const reviewServiceMock = {
  getReviewsByProduct: mk(),
  createReview: mk(),
  getAverageRating: mk(),
  getReviewByUser: mk(),
  getReviewById: mk(),
  findAndUpdateReview: mk(),
  deleteReview: mk(),
};

export const orderServiceMock = {
  createOrder: mk(),
  getOrderByQuery: mk(),
  findAndUpdateOrder: mk(),
  getOrdersByUser: mk(),
  getOrderById: mk(),
  checkUserOrder: mk(),
};

export const paymentServiceMock = {
  createNewOrder: mk(),
  verifyPayment: mk(),
  getPayment: mk(),
  refundPayment: mk(),
};

export const sendEmailMock = {
  confirmEmail: jest.fn(),
  forgotPassword: jest.fn((_user: any, res?: any) => {
    if (res && typeof res.status === 'function') {
      res.status(200).json({ message: 'Email sent' });
    }
  }),
  sendVerificationEmail: jest.fn(),
};

export const vectorSearchServiceMock = { similarDocuments: mk() };

export const jwtMock = {
  signedToken: jest.fn(() => 'signed-jwt'),
  verifyToken: jest.fn(() => ({ user: { id: defaultUser._id, admin: defaultUser.isAdmin, email: defaultUser.email } })),
};

export const azureUploadMocks = {
  uploadToAzure: jest.fn(async () => 'https://cdn.example.com/blob.jpg'),
  uploadMultipleFiles: jest.fn(async () => ['https://cdn.example.com/blob.jpg']),
  getAzureBlobUrl: jest.fn((path: string) => `https://cdn.example.com/${path}`),
  deleteFromAzure: jest.fn(async () => true),
};

export const generateVectorsMock = jest.fn(async () => [0.1, 0.2, 0.3]);
export const checkAndGenerateEmbeddingsMock = jest.fn();

export const uploadAnyMock = jest.fn(() => (req: any, _res: any, next: any) => {
  req.files = req.files || [
    { originalname: 'image.jpg', mimetype: 'image/jpeg', buffer: Buffer.from('file'), fieldname: 'image', size: 10 },
  ];
  next();
});

export const resetAllMocks = () => {
  jest.clearAllMocks();

  userServiceMock.getUserByQuery.mockResolvedValue(defaultUser);
  userServiceMock.createUser.mockResolvedValue({ ...defaultUser, _id: 'new-user', email: 'new@example.com' });
  userServiceMock.getUserByEmail.mockResolvedValue(defaultUser);
  userServiceMock.getUserByToken.mockResolvedValue({ ...defaultUser, verified: false });
  userServiceMock.findAndUpdateUser.mockResolvedValue(defaultUser);
  userServiceMock.resetPassword.mockResolvedValue(true as any);
  userServiceMock.getUserById.mockResolvedValue(defaultUser);
  userServiceMock.deleteUser.mockResolvedValue(defaultUser);

  productServiceMock.getProductsWithoutDescription.mockResolvedValue([{ _id: 'prod1', name: 'Product 1' }]);
  productServiceMock.getProductByCategory.mockResolvedValue([{ _id: 'prod1', name: 'Product 1', category: ['cat'] }]);
  productServiceMock.getProductById.mockResolvedValue({
    _id: 'prod1',
    name: 'Product 1',
    price: 100,
    countInStock: 5,
    image: ['https://cdn.example.com/blob.jpg'],
    category: ['cat'],
  });
  productServiceMock.getProductByQuery.mockResolvedValue([{ _id: 'prod1' }]);
  productServiceMock.createProduct.mockResolvedValue({ _id: 'prod1', name: 'Product 1' });
  productServiceMock.updateProduct.mockResolvedValue({ _id: 'prod1', name: 'Product 1 Updated' });
  productServiceMock.deleteProduct.mockResolvedValue({
    _id: 'prod1',
    name: 'Product 1',
    image: ['https://cdn.example.com/blob.jpg'],
    category: ['cat'],
  });
  productServiceMock.findAndUpdateProduct.mockResolvedValue({ _id: 'prod1', name: 'Product 1', rating: 4 });

  reviewServiceMock.getReviewsByProduct.mockResolvedValue([{ _id: 'rev1', product: 'prod1', rating: 4 }]);
  reviewServiceMock.createReview.mockResolvedValue({ _id: 'rev1', product: 'prod1', rating: 5, user: defaultUser._id });
  reviewServiceMock.getAverageRating.mockResolvedValue(4.5 as any);
  reviewServiceMock.getReviewByUser.mockResolvedValue(null);
  reviewServiceMock.getReviewById.mockResolvedValue({
    _id: 'rev1',
    product: 'prod1',
    rating: 4,
    user: defaultUser._id,
    comment: 'ok',
  });
  reviewServiceMock.findAndUpdateReview.mockResolvedValue({
    _id: 'rev1',
    product: 'prod1',
    rating: 5,
    user: defaultUser._id,
  });
  reviewServiceMock.deleteReview.mockResolvedValue(true);

  orderServiceMock.createOrder.mockResolvedValue({
    _id: 'order1',
    user: defaultUser._id,
    orderItems: [{ product: 'prod1', qty: 1 }],
    totalPrice: 100,
    paymentMethod: 'Cash',
    status: 'confirmed',
  } as any);
  orderServiceMock.getOrderByQuery.mockResolvedValue({
    _id: 'order1',
    user: defaultUser._id,
    orderItems: [{ product: 'prod1', qty: 1 }],
    totalPrice: 100,
    paymentMethod: 'Cash',
    paymentResult: {},
    status: 'confirmed',
    isPaid: false,
  } as any);
  orderServiceMock.findAndUpdateOrder.mockResolvedValue({ _id: 'order1', status: 'paid' } as any);
  orderServiceMock.getOrdersByUser.mockResolvedValue([{ _id: 'order1' }]);
  orderServiceMock.getOrderById.mockResolvedValue({ _id: 'order1' } as any);
  orderServiceMock.checkUserOrder.mockResolvedValue(true);

  paymentServiceMock.createNewOrder.mockResolvedValue({ id: 'rzp1', status: 'created', created_at: Date.now() });
  paymentServiceMock.verifyPayment.mockResolvedValue('Payment Successful');
  paymentServiceMock.getPayment.mockResolvedValue({ status: 'captured' });
  paymentServiceMock.refundPayment.mockResolvedValue({ status: 'refunded' });

  vectorSearchServiceMock.similarDocuments.mockResolvedValue([{ id: 'prod1', score: 0.9 }]);

  jwtMock.signedToken.mockReturnValue('signed-jwt');
  jwtMock.verifyToken.mockReturnValue({
    user: { id: defaultUser._id, admin: defaultUser.isAdmin, email: defaultUser.email },
  });

  generateVectorsMock.mockResolvedValue([0.1, 0.2, 0.3]);
  checkAndGenerateEmbeddingsMock.mockResolvedValue(undefined);

  uploadAnyMock.mockClear();
};
