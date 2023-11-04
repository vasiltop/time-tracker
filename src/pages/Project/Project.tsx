import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import TimeEntry from '../../components/TimeEntry/TimeEntry';
export default function Project() {
	const { id } = useParams<{ id: string }>();

	const { isLoading, data } = useQuery('project', () =>
		fetch(`http://localhost:8000/project/${id}`, {
			headers: {
				'x-user-id': '1',
			},
		}).then((res) => res.json())
	);

	if (isLoading) {
		return <p>Loading...</p>;
	}
	return (
		<>
			{data.tasks.map((task: any) => {
				return (
					<div key={task.id}>
						<Link to={`/task/${task.id}`}>{task.name}</Link>
					</div>
				);
			})}

			{data.entries.map((entry: any) => {
				return <TimeEntry key={entry.id} entryData={entry} />;
			})}
		</>
	);
}
