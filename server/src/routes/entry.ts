import { Router } from 'express';
import validate from '../middleware/validate';
import { z } from 'zod';
import { pool } from '../database';
import { DatabaseError } from 'pg';
import adminCheck from '../middleware/admin';

const router = Router();

const entrySchema = z.object({
	body: z.object({
		task_id: z.number().int().nonnegative(),
		date: z.string(),
		duration: z.number().int().nonnegative(),
		comment: z.string().min(1).max(255),
	}),
});

router.post('/', validate(entrySchema), async (req, res) => {
	try {
		const { rows } = await pool.query(
			'INSERT INTO time_entry (task_id, user_id, date, duration, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[
				req.body.task_id,
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
	try {
		const { rows } = await pool.query(
			'UPDATE time_entry SET date = $1, duration = $2, comment = $3 WHERE id = $4 AND approved = FALSE RETURNING *',
			[req.body.date, req.body.duration, req.body.comment, req.params.id]
		);

		res.send({ success: true, entry: rows[0] });
	} catch (e) {
		if (e instanceof DatabaseError) {
			return res.status(409).send({ success: false });
		}
		return res.status(500).send({ success: false });
	}
});

router.get('/submitted', adminCheck, async (req, res) => {
	try {
		const { rows: entries } = await pool.query(
			'SELECT * FROM time_entry WHERE submitted = TRUE AND approved = FALSE'
		);
		return res.send({ entries, success: true });
	} catch (e) {
		if (e instanceof DatabaseError) {
			return res.status(409).send({ success: false });
		}
		return res.status(500).send({ success: false });
	}
});

router.post('/approve', adminCheck, async (req, res) => {
	try {
		await pool.query(
			'UPDATE time_entry SET approved = $2, admin_message = $3, submitted = FALSE WHERE id = $1 ',
			[req.body.id, req.body.approved, req.body.comment]
		);
		return res.send({ success: true });
	} catch (e) {
		if (e instanceof DatabaseError) {
			return res.status(409).send({ success: false });
		}
		return res.status(500).send({ success: false });
	}
});
router.post('/submit', async (req, res) => {
	try {
		const { rows } = await pool.query(
			'UPDATE time_entry SET submitted = TRUE WHERE id = ANY($1) AND user_id = $2 AND submitted = FALSE AND approved = FALSE RETURNING *',
			[req.body.ids, req.headers['x-user-id']]
		);
		return res.send({ entries: rows, success: true });
	} catch (e) {
		if (e instanceof DatabaseError) {
			return res.status(409).send({ success: false });
		}
		return res.status(500).send({ success: false });
	}
});

export default router;
