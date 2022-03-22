import { numberWithCommas } from '../utils/Misc';

export default function ProfileBox(props: {
	avatar: number;
	displayName: string;
	netWorth: number;
	turnIncome: number;
	onClick?: () => void;
}) {
	const { avatar, displayName, netWorth, turnIncome } = props;
	return (
		<div className='rounded-box shadow profile-grid' {...props}>
			<div style={{ textAlign: 'center' }}>
				<img src={`/avatars/${avatar}.jpeg`} style={{ height: 200 }} />
			</div>
			<div>
				<h2 className='no-padding huge-and-bold'>{displayName}</h2>
				<p className='no-padding'>net-worth:</p>
				<h2 className='no-padding huge-and-bold'>
					${numberWithCommas(netWorth)}M
				</h2>
				<p className='no-padding'>earnings this turn:</p>
				<h2
					className='no-padding big-and-bold'
					style={{
						color: turnIncome >= 0 ? 'green' : 'red',
					}}>
					{turnIncome >= 0 ? '+' : '-'}$
					{numberWithCommas(Math.abs(turnIncome))}M
				</h2>
			</div>
		</div>
	);
}
