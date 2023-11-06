import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../database';
import { DatabaseError } from 'pg';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const { rows: projects } = await pool.query('SELECT * FROM project');

		const { rows: entries } = await pool.query(
			'SELECT * FROM time_entry WHERE user_id = $1',
			[req.headers['x-user-id']]
		);
		return res.send({ projects, entries, success: true });
	} catch (e) {
		if (e instanceof DatabaseError) {
			return res.status(409).send({ success: false });
		}
		return res.status(500).send({ success: false });
	}
});

router.get('/:id', async (req, res) => {
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
