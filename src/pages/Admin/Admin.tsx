import { useQuery } from 'react-query';
import { Link, Navigate } from 'react-router-dom';
import { Entry } from '../../types';
import TimeEntry from '../../components/TimeEntry/TimeEntry';
import { useState } from 'react';
import { baseUrl } from '../../api';

export default function Admin() {
	const [entries, setEntries] = useState<Entry[]>([]);

	const { isLoading, data } = useQuery('admin', async () => {
		const response = await fetch(`${baseUrl}/entry/submitted`, {
			headers: {
				'Content-Type': 'application/json',
				'x-user-id': '2',
			},
		});

		const json = await response.json();
		setEntries(json.entries);

		return json;
	});

	async function approveEntry(e: React.FormEvent<HTMLFormElement>, id: number) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const response = await fetch(`${baseUrl}/entry/approve`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-user-id': '2',
			},
			body: JSON.stringify({
				id,
				approved: !!formData.get('approved'), //used !! to convert to boolean
				comment: formData.get('comment'),
			}),
		});

		const json = await response.json();
		if (json.success) {
			setEntries(entries.filter((entry: Entry) => entry.id !== id));
		}
	}

	if (isLoading) return <> Loading </>;
	if (!data.success) return <Navigate to="/" />;

	if (!entries.length) {
		return (
			<>
				<div className="flex h-32 bg-base-300 justify-center items-center p-8 gap-8">
					<Link to="/" className="btn">
						Home
					</Link>
					<h2 className="text-lg font-bold"> No Entries to approve </h2>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="flex h-32 bg-base-300 justify-center items-center p-8 gap-8">
				<Link to="/" className="btn">
					Home
				</Link>
				<h2 className="text-lg font-bold"> Reject or Approve Entries </h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-8 p-4">
				{entries.map((entry: Entry) => {
					return (
						<div key={entry.id}>
							<TimeEntry entryData={entry} editable={false} />
							<form
								onSubmit={(e) => approveEntry(e, entry.id)}
								className="flex flex-col items-center gap-2 p-2"
							>
								<input
									type="text"
									className="input input-bordered"
									name="comment"
								/>

								<div className="flex gap-2">
									Reject
									<input type="checkbox" className="toggle" name="approved" />
									Approve
								</div>

								<button className="btn">Submit</button>
							</form>
						</div>
					);
				})}
			</div>
		</>
	);
}
