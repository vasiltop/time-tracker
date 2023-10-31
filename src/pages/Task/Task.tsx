import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

export default function Task() {
	const { id } = useParams<{ id: string }>();

	const { isLoading, data } = useQuery('task', () =>
		fetch(`http://localhost:8000/task/${id}`, {
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
						<h3>{task.name}</h3>
					</div>
				);
			})}
		</>
	);
}
