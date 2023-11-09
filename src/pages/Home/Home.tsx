import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import TimeEntry from '../../components/TimeEntry/TimeEntry';
import { useState } from 'react';
import { Entry } from '../../types';
import { baseUrl } from '../../api';

type Project = {
	id: number;
	name: string;
};

export default function Home() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [tip, setTip] = useState('');

	const { isLoading, data } = useQuery('projects', async () => {
		const response = await fetch(`${baseUrl}/project`, {
			headers: {
				'Content-Type': 'application/json',
				'x-user-id': '1',
			},
		});

		const json = await response.json();
		toggleDateRange(false, json.entries);
		return json;
	});

	function toggleDateRange(toggle: boolean, entries: Entry[]) {
		if (!toggle) {
			setEntries(
				entries.filter((entry: Entry) => {
					const date = new Date(entry.date);
					return (
						date.getMonth() === new Date().getMonth() &&
						date.getFullYear() === new Date().getFullYear()
					);
				})
			);
		} else {
			setEntries(
				entries.filter((entry: Entry) => {
					const date = new Date(entry.date);

					// 3 days added to get the week to start on Sunday as getTime() begins on Thursday
					const week = Math.floor(
						(date.getTime() + 3 * 86400000) / (7 * 86400000)
					);
					const currentWeek = Math.floor(
						(new Date().getTime() + 3 * 86400000) / (7 * 86400000)
					);

					return week === currentWeek;
				})
			);
		}
	}

	async function submitEntries() {
		const ids = entries.map((entry: Entry) => entry.id);

		if (ids.length === 0) return setTip('No entries to submit');
		const response = await fetch(`${baseUrl}/entry/submit`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-user-id': '1',
			},
			body: JSON.stringify({ ids }),
		});

		const json = await response.json();

		if (json.success) {
			setTip('Entries submitted successfully');
		} else {
			setTip('Entries submission failed');
		}
	}

	if (isLoading) return <> Loading... </>;

	return (
		<>
			<div className="flex h-32 bg-base-300 justify-center items-center p-8 gap-8">
				<Link to="/admin" className="btn">
					Admin Panel
				</Link>
				{data.projects.map((project: Project) => {
					return (
						<div key={project.id}>
							<Link to={`/project/${project.id}`} className="btn ">
								{project.name}
							</Link>
						</div>
					);
				})}
			</div>

			<div className="flex flex-col items-center gap-4 p-4">
				<div className="flex gap-4">
					Months
					<input
						type="checkbox"
						className="toggle"
						onChange={(e) => toggleDateRange(e.target.checked, entries)}
					/>
					Weeks
				</div>
				<button onClick={submitEntries} className="btn">
					Submit All
				</button>
				{tip && <p className="text-sm">{tip}</p>}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-8">
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
