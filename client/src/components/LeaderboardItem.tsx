import { useNavigate } from 'react-router-dom';
import { Col } from 'reactstrap';
import { UserData } from '../types/types';
import { numberWithCommas } from '../utils/Misc';

export interface LeaderboardItemProps extends UserData {
	position: number;
}

export default function LeaderboardItem(props: { data: LeaderboardItemProps }) {
	const navigate = useNavigate();
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
		<div
			onClick={() => navigate(`/profile/${data._id}`)}
			className='rounded-box shadow mt-3'>
			<h1 className='no-padding huge-and-bold'>
				{getPositionEmoji()} {data.profile?.displayName}
			</h1>
			<p className='no-padding'>net-worth:</p>
			<h2 className='no-padding huge-and-bold'>
				${numberWithCommas(data.game!.stats!.netWorth)}M
			</h2>
			<p className='no-padding'>earnings per day:</p>
			<h2
				style={{
					color: data.game!.stats!.turnIncome >= 0 ? 'green' : 'red',
				}}
				className='normal-and-bold no-padding'>
				{data.game!.stats!.turnIncome >= 0 ? '+' : '-'}$
				{numberWithCommas(Math.abs(data.game!.stats!.turnIncome))}M
			</h2>
		</div>
	);
}
