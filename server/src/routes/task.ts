import { Router } from 'express';
import { DatabaseError } from 'pg';
import { pool } from '../database';

const router = Router();

router.get('/:id', async (req, res) => {
	try {
		const taskId = req.params.id;
		const id = req.headers['x-user-id'];

		const { rows: entries } = await pool.query(
			'SELECT * FROM time_entry WHERE task_id = $1 AND user_id = $2  ',
			[taskId, id]
		);

		const { rows: tasks } = await pool.query(
			'SELECT * FROM task WHERE id = $1',
			[taskId]
		);

		return res.send({ tasks, entries, success: true });
	} catch (e) {
		if (e instanceof DatabaseError) {
			return res.status(409).send({ success: false });
		}
		return res.status(500).send({ success: false });
	}
});

export default router;
