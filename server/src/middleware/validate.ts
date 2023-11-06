import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export default function validate(schema: z.ZodSchema) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const parsedData = schema.parse({
				body: req.body,
			});
			req.body = parsedData.body;

			next();
		} catch (e) {
			if (e instanceof z.ZodError) {
				res.status(400).json({
					success: false,
					errors: e.errors,
				});
			}
			return res.status(500).send({ success: false });
		}
	};
}
