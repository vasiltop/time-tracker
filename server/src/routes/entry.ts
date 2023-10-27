import { Router } from 'express';

const router = Router();

router.post('/create', (req, res) => {
	//Create new time entry
});

router.post('/update', (req, res) => {
	//Update time entry
});

router.get('/project/:id', (req, res) => {});

router.get('/', (req, res) => {
	//Get all time entries if user is an admin
});

export default router;
