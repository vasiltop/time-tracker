import { Router } from 'express';
import validate from '../middleware/validate';
import { z } from 'zod';
import { pool } from '../database';
import { DatabaseError } from 'pg';

const router = Router();

const entrySchema = z.object({
	body: z.object({
		taskId: z.number().int().nonnegative(),
		date: z.string(),
		duration: z.number().int().nonnegative(),
		comment: z.string().min(1).max(255),
	}),
});

router.post('/create', validate(entrySchema), async (req, res) => {
	//Create new time entry

	try {
		const { rows } = await pool.query(
			'INSERT INTO time_entry (task_id, user_id, entry_date, duration, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[
				req.body.taskId,
				req.headers['x-user-id'],
				req.body.date,
				req.body.duration,
				req.body.comment,
			]
		);

		res.send({ success: true, entry: rows[0] });
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
