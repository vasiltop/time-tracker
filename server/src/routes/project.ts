import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../database';
import { DatabaseError } from 'pg';

const router = Router();

const projectSchema = z.object({
	body: z.object({
		name: z.string().min(1).max(255),
	}),
});

router.get('/', async (req, res) => {
	try {
		const { rows } = await pool.query('SELECT * FROM project');
		return res.send({ projects: rows, success: true });
	} catch (e) {
		if (e instanceof DatabaseError) {
			return res.status(409).send({ success: false });
		}
	}
});

export default router;
