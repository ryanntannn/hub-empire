interface CardProps {
	emoji: string;
	displayName: string;
	value: number;
	returns: number;
	color: string;
}

export default function Card(props: CardProps) {
	return (
		<div className='rounded-box shadow card'>
			<div
				className='top-color-area'
				style={{ backgroundColor: props.color }}></div>
			<h1
				style={{
					fontSize: 50,
				}}>
				{props.emoji}
			</h1>
			<p className='normal-and-bold no-padding'>{props.displayName}</p>
			<p className='normal-and-bold no-padding'>${props.value}</p>
			<p
				style={{ color: props.returns >= 0 ? 'green' : 'red' }}
				className='normal-and-bold no-padding'>
				{props.returns >= 0 ? '+' : '-'}${props.returns}
			</p>
		</div>
	);
}
