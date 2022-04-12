import Countdown from 'react-countdown';

interface CountdownProps {
	epoch: number;
}

export function CountdownTimer(props: CountdownProps) {
	function getDate(epoch: number) {
		return new Date(epoch);
	}

	return (
		<div
			style={{ backgroundColor: '#FAFAFA' }}
			className='rounded-box shadow'>
			<b>Next turn in:</b>
			<h2 className='no-padding big-and-bold'>
				<Countdown date={getDate(props.epoch)} />
			</h2>
			<p className='no-padding'>
				Next turn: <b>{getDate(props.epoch).toLocaleString()}</b>
			</p>
		</div>
	);
}
