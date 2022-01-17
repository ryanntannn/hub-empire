import { Container } from 'reactstrap';
import BackButton from './BackButton';
import LeaderboardItem, { LeaderboardItemProps } from './LeaderboardItem';

export default function Leaderboard() {
	const testItems: LeaderboardItemProps[] = [
		{
			name: 'Test',
			netWorth: 0,
			earnings: 0,
			position: 0,
		},
		{
			name: 'Test',
			netWorth: 0,
			earnings: 0,
			position: 0,
		},
		{
			name: 'Test',
			netWorth: 0,
			earnings: 0,
			position: 0,
		},
	];

	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>🏆 Leaderboard</h1>
				{testItems.map((item, i) => {
					item.position = i;
					return <LeaderboardItem data={item} />;
				})}
			</Container>
		</div>
	);
}
