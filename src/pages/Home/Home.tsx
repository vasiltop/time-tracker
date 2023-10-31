import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

export default function Home() {
	/*
	fetch('http://localhost:8000/entry/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			taskId: 1,
			userId: 1,
			entryDate: new Date().toISOString(),
			duration: '1 year 2 months 5 days 50 seconds',
			comment: 'sup',
		}),
	});
	*/

	const { isLoading, data } = useQuery('projects', () =>
		fetch('http://localhost:8000/project').then((res) => res.json())
	);

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
		</>
	);
}
