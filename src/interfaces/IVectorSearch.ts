import { IProduct, Product } from '@models/productModel';

export class VectorSearchService {
  /**
   * @description Perform a vector search in the MongoDB collection based on the user query.
   * @feature Get Single Image URL for each product
   * @feature All Products according to user search query
   * @Access Public access
   */

  public async similarDocuments(queryEmbedding: number[]): Promise<IProduct[]> {
    // Define the vector search pipeline
    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          queryVector: queryEmbedding,
          path: 'embeddings',
          numCandidates: 150, // Number of candidate matches to consider
          limit: 10, // Return top 4 matches
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          description: 1, // Include the plot field
          name: 1, // Include the title field
          category: 1, // Include the genres field
          score: { $meta: 'vectorSearchScore' }, // Include the search score
        },
      },
      {
        $match: {
          score: { $gt: 0.6 }, // Filter out low-scoring results
        },
      },
    ];

    // Perform the vector search
    const products = await Product.aggregate(pipeline);

    return products;
  }
}
