import { NextFunction, Request, Response } from 'express';

import { ProductService } from '@interfaces/IProduct';
import { uploadToAzure, uploadMultipleFiles, getAzureBlobUrl, deleteFromAzure } from '@utils/azureUpload';
import { sanitizeFilename } from '@utils/slugify';
import { generate_vectors } from '@utils/generateEmbeddings';
import {
  CreateProductInput,
  ProductByCategoryInput,
  ProductByIdInput,
  UpdateProductInput,
} from '@schema/productSchema';

export class ProductController {
  private productService = new ProductService();

  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.getProductsWithoutDescription();

      // Transform the products to include only the first image URL
      const result = products.map((product) => {
        return {
          ...product,
          image: product.image && product.image.length > 0 ? product.image[0] : null,
        };
      });

      return res.status(200).json({
        data: result,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public getProductByCategory = async (
    req: Request<ProductByCategoryInput['params']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const products = await this.productService.getProductByCategory(req.params.category);

      if (!products) {
        return res.status(400).json({
          message: 'Something went wrong',
        });
      }

      // Transform the products to include only the first image URL
      const result = products.map((product) => {
        return {
          ...product,
          image: product.image && product.image.length > 0 ? product.image[0] : null,
        };
      });

      return res.status(200).json({
        data: result,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public getProductById = async (req: Request<ProductByIdInput['params']>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.productId as string;

      const product = await this.productService.getProductById(id);

      if (!product) {
        return res.status(400).json({
          message: 'Product does not exist',
        });
      }

      return res.status(200).json({
        data: product,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public filterProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query;

      const products = await this.productService.getProductByQuery(query);

      if (!products) {
        return res.status(400).json({
          message: 'Something went wrong',
        });
      }

      return res.status(200).json({
        data: products,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public createProduct = async (req: Request<{}, CreateProductInput['body']>, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({
          message: 'Please upload an image/video',
        });
      }

      const files = req.files as Express.Multer.File[];

      if (files.length === 0) {
        return res.status(400).json({
          message: 'Please upload at least one image/video',
        });
      }

      // Allow only images or videos to be uploaded
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
        'video/mp4',
        'video/mpeg',
        'video/mov',
      ];
      const allowed = files.every((file) => allowedTypes.includes(file.mimetype));

      if (!allowed) {
        return res.status(400).json({
          message: 'File is not supported, please upload an image or video',
        });
      }

      // Upload images to Azure Blob Storage
      const uploadPromises = files.map((file) => {
        const sanitizedFieldName = sanitizeFilename(file.originalname);
        const blobName = `${sanitizedFieldName}`;
        const buffer = file.buffer;

        return uploadToAzure(blobName, buffer, file.mimetype);
      });

      const imageUrls = await Promise.all(uploadPromises);

      // Parse the categories from the request body
      const categories = typeof req.body.category === 'string' ? JSON.parse(req.body.category) : req.body.category;

      // Add image URLs to the product data
      const productData = {
        ...req.body,
        category: categories,
        image: imageUrls,
      };

      // Generate Vector Embeddings for the product description using Python-Flask API
      const embeddings = await generate_vectors(productData.description);

      // Add the embeddings to the product data
      const _productData = {
        ...productData,
        embeddings: embeddings,
      };

      const product = await this.productService.createProduct(_productData);

      return res.status(201).json({
        data: product,
      });
    } catch (err: any) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }
  };

  public updateProduct = async (
    req: Request<ProductByIdInput['params'], UpdateProductInput['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.productId as string;
      const files = req.files as Express.Multer.File[];

      const productExists = await this.productService.getProductById(id);

      if (!productExists) {
        return res.status(400).json({
          message: 'Product does not exist',
        });
      }

      // Allow only images or videos to be uploaded
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/mpeg', 'video/mov'];
      const allowed = files.every((file) => allowedTypes.includes(file.mimetype));

      if (!allowed) {
        return res.status(400).json({
          message: 'File is not supported, please upload an image or video',
        });
      }

      // Upload images to Azure Blob Storage
      const uploadPromises = files.map((file) => {
        const sanitizedFieldName = sanitizeFilename(file.originalname);
        const blobName = `${sanitizedFieldName}`;
        const buffer = file.buffer;

        return uploadToAzure(blobName, buffer, file.mimetype);
      });

      const newImageUrls = await Promise.all(uploadPromises);
      // Merge existing images with new images
      const mergedImages = [...productExists.image, ...newImageUrls];

      // Parse the categories from the request body
      let newCategories;
      try {
        newCategories = typeof req.body.category === 'string' ? JSON.parse(req.body.category) : req.body.category;
      } catch (err) {
        return res.status(400).json({
          message: 'Invalid category format',
        });
      }

      // Merge existing categories with new categories
      const mergedCategories = [...new Set([...productExists.category, ...newCategories])];

      // Prepare the product data
      const productData = {
        ...req.body,
        category: mergedCategories,
        image: mergedImages,
      };

      console.log('payload: ', productData);

      const product = await this.productService.updateProduct(id, productData);

      if (!product) {
        return res.status(400).json({
          message: 'Product does not exist',
        });
      }

      return res.status(200).json({
        data: product,
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };

  public deleteProduct = async (req: Request<ProductByIdInput['params']>, res: Response, next: NextFunction) => {
    try {
      const id = req.params.productId as string;

      const product = await this.productService.deleteProduct(id);

      if (!product) {
        return res.status(400).json({
          message: 'Product does not exist',
        });
      }

      // Delete images from Azure Blob Storage
      const imageUrls = product.image;

      const deletePromises = imageUrls.map((url) => {
        const blobName = url.split('/').pop();

        return deleteFromAzure(blobName as string);
      });

      await Promise.all(deletePromises);

      return res.status(200).json({
        message: 'Product deleted successfully',
      });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  };
}
