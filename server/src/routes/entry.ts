import { Router } from 'express';
import validate from '../middleware/validate';
import { z } from 'zod';
import { pool } from '../database';
import { DatabaseError } from 'pg';

const router = Router();

const entrySchema = z.object({
	body: z.object({
		taskId: z.number().int().nonnegative(),
		userId: z.number().int().nonnegative(),
		entryDate: z.string(),
		duration: z.number().int().nonnegative(),
		comment: z.string().min(1).max(255),
	}),
});

/*

params: z.preprocess(
		(n) => parseInt(z.string().parse(n), 10),
		z.number().int().positive()
	),

	*/

router.post('/create', validate(entrySchema), async (req, res) => {
	//Create new time entry

	try {
		await pool.query(
			'INSERT INTO time_entry (task_id, user_id, entry_date, duration, comment) VALUES ($1, $2, $3, $4, $5)',
			[
				req.body.taskId,
				req.body.userId,
				req.body.entryDate,
				req.body.duration,
				req.body.comment,
			]
		);

		res.send({ success: true });
	} catch (e) {
		if (e instanceof DatabaseError) {
			return res.status(409).send({ success: false });
		}
		return res.status(500).send({ success: false });
	}
});

router.post('/update/:id', async (req, res) => {
	//Update time entry
});

router.get('/', async (req, res) => {
	//check if user is an admin
	try {
		const { rows } = await pool.query('SELECT * FROM time_entry');
		return res.send({ entries: rows, success: true });
	} catch (e) {
		if (e instanceof DatabaseError) {
			return res.status(409).send({ success: false });
		}
		return res.status(500).send({ success: false });
	}
});

export default router;
