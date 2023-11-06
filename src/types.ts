export type Entry = {
	id: number;
	task_id: number;
	user_id: number;
	date: string;
	duration: number;
	comment: string;
	admin_message: string;
	approved: boolean;
	submitted: boolean;
};
