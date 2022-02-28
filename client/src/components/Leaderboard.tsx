import { Container } from 'reactstrap';
import { GetLeaderboardRes } from '../types/api';
import BackButton from './BackButton';
import LeaderboardItem, { LeaderboardItemProps } from './LeaderboardItem';
import useAuth from '../contexts/AuthenticationContext';
import React from 'react';
import Loading from './Loading';
import { UserDataBasic } from '../types/types';

export default function Leaderboard() {
	const auth = useAuth();

	const [leaderboardData, setLeaderboardData] = React.useState<
		UserDataBasic[] | null
	>();

	React.useEffect(() => {
		if (leaderboardData != null) return;
		console.log(auth.user);
		auth.authenticatedGet('/leaderboard', { gameId: '1234' })
			.then((res: any) => {
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
			{leaderboardData != null ? (
				<Container className='mt-5'>
					<BackButton />
					<h1 className='title'>🏆 Leaderboard</h1>
					{leaderboardData!.map((item, i) => {
						const newProps = { ...item, position: i };
						return <LeaderboardItem data={newProps} />;
					})}
				</Container>
			) : (
				<Loading />
			)}
		</div>
	);
}
