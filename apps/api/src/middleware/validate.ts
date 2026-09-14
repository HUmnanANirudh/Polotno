import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../lib/app-error.ts';

export function validate(
  schema: z.ZodType,
  source: 'body' | 'params' | 'query' = 'body'
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      throw new AppError(400, 'Validation failed', result.error.issues);
    }
    
    if (source === 'body') {
      req.body = result.data;
    } else if (source === 'params') {
      req.params = result.data as any;
    } else if (source === 'query') {
      req.query = result.data as any;
    }
    
    next();
  };
}
