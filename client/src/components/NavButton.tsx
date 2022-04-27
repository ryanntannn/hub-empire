import { Link } from 'react-router-dom';

interface NavButtonProps {
	linkTo: string;
	emoji: string;
	title: string;
	color: string;
	onClick?: () => void;
}

export default function NavButton(props: NavButtonProps) {
	return (
		<Link
			to={props.linkTo}
			style={{
				textDecoration: 'none',
			}}
			onClick={props.onClick}>
			<div
				style={{
					backgroundColor: props.color,
					color: 'white',
					textAlign: 'center',
					textDecoration: 'none',
				}}
				className='rounded-box shadow clickable'>
				<h1
					style={{
						fontSize: 50,
					}}>
					{props.emoji}
				</h1>
				<p className='normal-and-bold no-padding'>{props.title}</p>
			</div>
		</Link>
	);
}
