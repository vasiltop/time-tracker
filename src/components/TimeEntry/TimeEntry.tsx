import { useState } from 'react';
import type { Entry } from '../../types';

type TimeEntryProps = {
	entryData: Entry;
	editable: boolean;
};

export default function ({ entryData, editable }: TimeEntryProps) {
	const [tip, setTip] = useState('');

	async function updateEntry(e: React.FormEvent<HTMLFormElement>) {
		if (entryData.approved) return;
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const entry = {
			date: formData.get('date') as string,
			duration:
				parseInt(formData.get('hours') as string) * 60 +
				parseInt(formData.get('minutes') as string),
			comment: formData.get('comment') as string,
		};

		const response = await fetch(
			`http://localhost:8000/entry/update/${entryData.id}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-user-id': '1',
				},
				body: JSON.stringify(entry),
			}
		);

		const json = await response.json();

		if (json.success) {
			setTip('Entry updated successfully');
		} else {
			setTip('Entry update failed');
		}
	}

	return (
		<>
			<form
				onSubmit={updateEntry}
				className="card w-96 bg-base-300 shadow-xl p-4 flex flex-col gap-2"
			>
				<h2 className=" text-lg font-medium">Date </h2>
				<input
					type="date"
					name="date"
					className="input input-bordered"
					defaultValue={entryData.date.slice(0, 10)}
					disabled={!editable}
					required
				></input>

				<h2 className=" text-lg font-medium"> Duration </h2>

				<h4> Hours </h4>
				<input
					type="number"
					name="hours"
					min="0"
					max="23"
					className="input input-bordered"
					defaultValue={Math.floor(entryData.duration / 60)}
					disabled={!editable}
					required
				></input>

				<h4> Minutes </h4>
				<input
					type="number"
					name="minutes"
					min="0"
					max="59"
					className="input input-bordered"
					defaultValue={Math.floor(entryData.duration % 60)}
					disabled={!editable}
					required
				></input>

				<h2 className=" text-lg font-medium">Comment </h2>
				<input
					type="text"
					name="comment"
					className="input input-bordered"
					defaultValue={entryData.comment}
					disabled={!editable}
					required
				></input>

				{entryData.admin_message && (
					<div>
						<h5>Admin Message</h5>
						<p> {entryData.admin_message} </p>
					</div>
				)}

				{editable && (
					<button type="submit" className="btn">
						Update
					</button>
				)}

				{tip && <p className="text-sm"> {tip} </p>}
			</form>
		</>
	);
}
