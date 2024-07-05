import { NextFunction, Request, Response } from 'express';
import { VectorSearchService } from '@interfaces/IVectorSearch';
import { generate_vectors } from '@utils/generateEmbeddings';

export class VectorSearchController {
  private vectorSearchService: VectorSearchService;

  constructor() {
    this.vectorSearchService = new VectorSearchService();
    this.vectorSearch = this.vectorSearch.bind(this);
  }

  public async vectorSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchQuery: string = req.query.vs as string;

      const queryEmbedding: number[] = await generate_vectors(searchQuery);

      if (!queryEmbedding) {
        res.status(400).json({
          message: 'Something went wrong! Please try again.',
        });
        return;
      }

      const result = await this.vectorSearchService.similarDocuments(queryEmbedding);

      res.status(200).json({ data: result });
    } catch (err: any) {
      res.status(500).send('Internal Server Error');
      console.error(err.message);
    }
  }
}
