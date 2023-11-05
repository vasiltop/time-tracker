import express from 'express';
import { pool } from './database';
import cors from 'cors';
import entryRoute from './routes/entry';
import projectRoute from './routes/project';
import taskRoute from './routes/task';

async function main() {
	await pool.connect();
	console.log('Connected to database.');

	const app = express();
	const port = 8000;

	app.use(express.json());
	app.use(cors());
	app.use((req, res, next) => {
		res.appendHeader('Cache-Control', 'no-cache, no-store');
		next();
	});
	app.use('/entry', entryRoute);
	app.use('/project', projectRoute);
	app.use('/task', taskRoute);

	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}

main();
