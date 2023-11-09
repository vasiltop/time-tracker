import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import TimeEntry from '../../components/TimeEntry/TimeEntry';
import { Entry } from '../../types';
mport { baseUrl } from '../../api';

type Task = {
	id: number;
	name: string;
};

export default function Project() {
	const { id } = useParams<{ id: string }>();

	const { isLoading, data } = useQuery('project', () =>
		fetch(`${baseUrl}/project/${id}`, {
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
			<div className="flex h-32 bg-base-300 justify-center items-center p-8 gap-8">
				<Link to="/" className="btn">
					Home
				</Link>
				{data.tasks.map((task: Task) => {
					return (
						<div key={task.id}>
							<Link to={`/task/${task.id}`} className="btn">
								{task.name}
							</Link>
						</div>
					);
				})}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-8 p-4">
				{data.entries.map((entry: Entry) => {
					return (
						<TimeEntry
							key={entry.id}
							entryData={entry}
							editable={!entry.approved}
						/>
					);
				})}
			</div>
		</>
	);
}
