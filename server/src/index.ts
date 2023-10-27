import express from 'express';
import { pool } from './database';
import cors from 'cors';
import entryRoute from './routes/entry';

async function main() {
	await pool.connect();
	console.log('Connected to database.');

	const app = express();
	const port = 8000;

	app.use(express.json());
	app.use(cors());
	app.use('/entry', entryRoute);

	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}

main();
