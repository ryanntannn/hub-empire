import { Container } from 'reactstrap';
import { GetLeaderboardRes } from '../types/api';
import BackButton from './BackButton';
import LeaderboardItem, { LeaderboardItemProps } from './LeaderboardItem';
import useAuth from '../contexts/AuthenticationContext';
import React from 'react';
import Loading from './Loading';
import { UserData } from '../types/types';

export default function Leaderboard() {
	const auth = useAuth();

	const [leaderboardData, setLeaderboardData] = React.useState<
		UserData[] | null
	>();

	React.useEffect(() => {
		console.log(auth.user);
		if (leaderboardData != null) return;
		auth.authenticatedGet('/leaderboard', {
			gameId: auth.user.userData.game!.id!,
		})
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
				<h1 className='title'>🏆 Leaderboard</h1>

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
