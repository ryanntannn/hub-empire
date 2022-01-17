export interface LeaderboardItemProps {
	name: string;
	netWorth: number;
	earnings: number;
	position: number;
}

export default function LeaderboardItem(props: { data: LeaderboardItemProps }) {
	const data = props.data;
	const getPositionEmoji = () => {
		switch (data.position) {
			case 0:
				return '🥇';
			case 1:
				return '🥈';
			case 2:
				return '🥉';
			default:
				return '';
		}
	};
	return (
		<div className='rounded-box shadow'>
			<h1 className='no-padding huge-and-bold'>
				{getPositionEmoji()} {data.name}
			</h1>
			<p className='no-padding'>net-worth:</p>
			<h2 className='no-padding huge-and-bold'>${data.netWorth}</h2>
			<p className='no-padding'>earnings per day:</p>
			<h2 className='no-padding big-and-bold' style={{ color: 'green' }}>
				${data.netWorth}
			</h2>
		</div>
	);
}
