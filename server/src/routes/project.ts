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
		return res.status(500).send({ success: false });
	}
});
router.get('/:id', async (req, res) => {
	res.appendHeader('Cache-Control', 'no-cache, no-store');

	try {
		const projectId = req.params.id;

		const id = req.headers['x-user-id'];

		const { rows: entries } = await pool.query(
			'SELECT * FROM time_entry WHERE task_id IN (SELECT id FROM task WHERE project_id = $1) AND user_id = $2',
			[projectId, id]
		);

		const { rows: tasks } = await pool.query(
			'SELECT * FROM task WHERE project_id = $1',
			[projectId]
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
