import { useNavigate } from 'react-router-dom';
import { Col } from 'reactstrap';
import { UserData } from '../types/types';
import { numberWithCommas } from '../utils/Misc';
import ProfileBox from './ProfileBox';

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
		<div className='mt-3'>
			<ProfileBox
				onClick={() => navigate(`/profile/${data._id}`)}
				avatar={data.profile?.avatar!}
				displayName={
					getPositionEmoji() + ' ' + data.profile?.displayName!
				}
				netWorth={data.game?.stats?.netWorth!}
				turnIncome={data.game?.stats?.turnIncome!}
			/>
		</div>
	);
}
