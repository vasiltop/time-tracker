import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import TimeEntry from '../../components/TimeEntry/TimeEntry';
import { useState } from 'react';

export default function Home() {
	const [entries, setEntries] = useState([]);

	const { isLoading, data } = useQuery('projects', async () => {
		const response = await fetch('http://localhost:8000/project', {
			headers: {
				'Content-Type': 'application/json',
				'x-user-id': '1',
			},
		});

		const json = await response.json();
		setEntries(
			json.entries.filter((entry: any) => {
				const date = new Date(entry.entry_date);
				return date.getMonth() === new Date().getMonth();
			})
		);
		return json;
	});

	function toggleDateRange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.checked) {
			setEntries(
				data.entries.filter((entry: any) => {
					const date = new Date(entry.entry_date);
					return date.getMonth() === new Date().getMonth();
				})
			);
		} else {
			const test = data.entries.filter((entry: any) => {
				const date = new Date(entry.entry_date);
				const week = Math.floor(
					(date.getTime() + 3 * 86400000) / (7 * 86400000)
				);
				const currentWeek = Math.floor(
					(new Date().getTime() + 3 * 86400000) / (7 * 86400000)
				);
				console.log(week, currentWeek, entry.entry_date);

				return week === currentWeek;
			});
			console.log(test);
			setEntries(test);
		}
	}
	if (isLoading) return <> Loading... </>;

	return (
		<>
			{data.projects.map((project: any) => {
				return (
					<div key={project.id}>
						<Link to={`/project/${project.id}`}>{project.name}</Link>
					</div>
				);
			})}
			Months
			<input type="checkbox" onChange={toggleDateRange} />
			Weeks
			{entries.map((entry: any) => {
				return (
					<div key={entry.id}>
						<TimeEntry entryData={entry} />
					</div>
				);
			})}
		</>
	);
}
