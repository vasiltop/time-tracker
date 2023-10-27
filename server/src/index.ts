import express from 'express';
import { pool } from './database';
import cors from 'cors';
import userRoute from './routes/user';

async function main() {
	await pool.connect();
	console.log('Connected to database.');

	const app = express();
	const port = 8000;

	app.use(express.json());
	app.use(cors());
	app.use('/user', userRoute);
	app.use('/task', userRoute);

	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}

main();
