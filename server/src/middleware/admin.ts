import { NextFunction, Request, Response } from 'express';
import { pool } from '../database';

export default async function adminCheck(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const id = req.headers['x-user-id'];
	const { rows: admins } = await pool.query(
		'SELECT id FROM "user" WHERE admin = TRUE AND id = $1',
		[id]
	);

	if (!admins.length) {
		return res.status(403).send({ success: false });
	}

	next();
}
