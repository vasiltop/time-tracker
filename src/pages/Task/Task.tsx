import { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

type Entry = {
	taskId: number;
	date: string;
	duration: number;
	comment: string;
};

export default function Task() {
	const { id } = useParams<{ id: string }>();
	const [entries, setEntries] = useState<Entry[]>([]);

	const { isLoading, data } = useQuery('task', async () => {
		const res = await fetch(`http://localhost:8000/task/${id}`, {
			headers: {
				'x-user-id': '1',
			},
		});
		const data = await res.json();
		if (data.success) setEntries(data.entries);
		return data;
	});

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const entry: Entry = {
			taskId: parseInt(id!),
			date: formData.get('date') as string,
			duration:
				parseInt(formData.get('hours') as string) * 60 +
				parseInt(formData.get('minutes') as string),
			comment: formData.get('comment') as string,
		};

		const response = await fetch(`http://localhost:8000/entry/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-user-id': '1',
			},
			body: JSON.stringify(entry),
		});

		const json = await response.json();

		if (json.success) {
			setEntries([...entries, json.entry]);
		}
	};

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<>
			{data.tasks.map((task: any) => {
				return (
					<div key={task.id}>
						<h3>{task.name}</h3>
					</div>
				);
			})}
			{entries.map((entry: any) => {
				return (
					<div key={entry.id}>
						<h3>{entry.comment}</h3>
					</div>
				);
			})}
			<form onSubmit={onSubmit}>
				<h1> Submit an entry.</h1>
				<h3>Date</h3>
				<input type="date" name="date" required></input>

				<h3> Duration </h3>

				<h4> Hours </h4>
				<input type="number" name="hours" min="0" max="23" required></input>

				<h4> Minutes </h4>
				<input type="number" name="minutes" min="0" max="59" required></input>

				<h4> Comment </h4>
				<input type="text" name="comment" required></input>

				<button type="submit">Create</button>
			</form>
		</>
	);
}
