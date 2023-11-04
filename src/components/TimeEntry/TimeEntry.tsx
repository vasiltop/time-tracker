import { useState } from 'react';

export default function ({ entryData }: any) {
	console.log(entryData);
	const [date, setDate] = useState(entryData.entry_date);
	const [hours, setHours] = useState(entryData.duration / 60);
	const [minutes, setMinutes] = useState(entryData.duration % 60);
	const [comment, setComment] = useState(entryData.comment);

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
			setDate(json.entry.entry_date);
			setHours(json.entry.duration / 60);
			setMinutes(json.entry.duration % 60);
			setComment(json.entry.comment);
		}
	}

	return (
		<>
			<form onSubmit={updateEntry}>
				<h3>Date</h3>
				<input
					type="date"
					name="date"
					defaultValue={date.slice(0, 10)}
					disabled={entryData.approved}
					required
				></input>

				<h3> Duration </h3>

				<h4> Hours </h4>
				<input
					type="number"
					name="hours"
					min="0"
					max="23"
					defaultValue={hours}
					disabled={entryData.approved}
					required
				></input>

				<h4> Minutes </h4>
				<input
					type="number"
					name="minutes"
					min="0"
					max="59"
					defaultValue={minutes}
					disabled={entryData.approved}
					required
				></input>

				<h4> Comment </h4>
				<input
					type="text"
					name="comment"
					defaultValue={comment}
					disabled={entryData.approved}
					required
				></input>

				{!entryData.approved && <button type="submit">Update</button>}
			</form>
		</>
	);
}
