import { Col } from 'reactstrap';

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
		<div className='rounded-box shadow mt-3'>
			<h1 className='no-padding huge-and-bold'>
				{getPositionEmoji()} {data.name}
			</h1>
			<p className='no-padding'>net-worth:</p>
			<h2 className='no-padding huge-and-bold'>${data.netWorth}</h2>
			<p className='no-padding'>earnings per day:</p>
			<h2
				style={{ color: data.earnings >= 0 ? 'green' : 'red' }}
				className='normal-and-bold no-padding'>
				{data.earnings >= 0 ? '+' : '-'}${data.earnings}
			</h2>
		</div>
	);
}
