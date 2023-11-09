import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import TimeEntry from '../../components/TimeEntry/TimeEntry';
import type { Entry } from '../../types';
import { baseUrl } from '../../api';

type CreatedEntry = {
	task_id: number;
	date: string;
	duration: number;
	comment: string;
};

export default function Task() {
	const { id } = useParams<{ id: string }>();
	const [entries, setEntries] = useState<Entry[]>([]);
	const [tip, setTip] = useState('');

	const { isLoading, data } = useQuery('task', async () => {
		const res = await fetch(`${baseUrl}/task/${id}`, {
			headers: {
				'x-user-id': '1',
			},
		});
		const json = await res.json();
		if (json.success) setEntries(json.entries);
		return json;
	});

	async function createEntry(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const entry: CreatedEntry = {
			task_id: parseInt(id!),
			date: formData.get('date') as string,
			duration:
				parseInt(formData.get('hours') as string) * 60 +
				parseInt(formData.get('minutes') as string),
			comment: formData.get('comment') as string,
		};

		const response = await fetch(`${baseUrl}/entry`, {
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
			setTip('Entry created successfully');
		} else {
			setTip('Entry creation failed');
		}
	}

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<div className="flex h-32 bg-base-300 justify-center items-center p-8 gap-8">
				<Link to="/" className="btn">
					Home
				</Link>
				{data.tasks.map((task: any) => {
					return (
						<div key={task.id} className="btn">
							<h3>{task.name}</h3>
						</div>
					);
				})}
			</div>

			<form
				onSubmit={createEntry}
				className="flex flex-col items-center gap-2 p-4"
			>
				<h2 className=" text-xl font-bold">Create an Entry: </h2>

				<h2 className=" text-lg font-bold">Date </h2>
				<input
					type="date"
					name="date"
					className="input input-bordered"
					required
				></input>

				<h2 className=" text-lg font-bold">Duration </h2>

				<h2 className=" text-lg font-medium">Hours </h2>
				<input
					type="number"
					name="hours"
					min="0"
					className="input input-bordered"
					max="23"
					required
				></input>

				<h2 className=" text-lg font-medium">Minutes </h2>
				<input
					type="number"
					name="minutes"
					min="0"
					className="input input-bordered"
					max="59"
					required
				></input>

				<h2 className=" text-lg font-bold">Comment </h2>
				<input
					type="text"
					name="comment"
					className="input input-bordered"
					required
				></input>

				<button type="submit" className="btn">
					Create
				</button>
				{tip && <p className="text-sm">{tip}</p>}
			</form>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-8 p-4">
				{entries.map((entry: Entry) => {
					return (
						<div key={entry.id}>
							<TimeEntry entryData={entry} editable={!entry.approved} />
						</div>
					);
				})}
			</div>
		</>
	);
}
