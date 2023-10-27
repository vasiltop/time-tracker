import { pool } from './database';
import fs from 'node:fs';

async function main() {
	const sql = fs.readFileSync('./scripts/setup.sql', 'utf-8');
	await pool.query(sql);
	console.log('Query executed.');
}

main();
