import React from 'react';
import { Container } from 'reactstrap';
import { UserData } from '../../types/types';
import BackButton from '../BackButton';
import LeaderboardItem from '../LeaderboardItem';
import Loading from '../Loading';
import useAuth from '../../contexts/AuthenticationContext';

export default function AdminLeaderboard() {
	const auth = useAuth();

	const [leaderboardData, setLeaderboardData] = React.useState<
		UserData[] | null
	>();

	React.useEffect(() => {
		console.log(auth.user);
		if (leaderboardData != null) return;
		auth.authenticatedGet('/admin/leaderboard')
			.then((res: any) => {
				console.log(res);
				setLeaderboardData(
					res.data.players.map((x: any) => ({ ...x, id: x._id }))
				);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>🏆 Admin Leaderboard</h1>

				{leaderboardData != null ? (
					leaderboardData!.map((item, i) => {
						const newProps = { ...item, position: i };
						return <LeaderboardItem data={newProps} key={i} />;
					})
				) : (
					<Loading />
				)}
			</Container>
		</div>
	);
}
