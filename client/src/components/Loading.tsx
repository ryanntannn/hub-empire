import { Spinner } from 'reactstrap';

export interface LoadingProps {
	flavour?: string;
}

export default function Loading(props: LoadingProps) {
	return (
		<div
			style={{
				position: 'absolute',
				top: '50%',
				right: '50%',
				transform: 'translate(50%,-50%)',
				textAlign: 'center',
			}}>
			<Spinner />
			<br />
			<b>{props.flavour != undefined ? props.flavour : 'Loading'}...</b>
		</div>
	);
}
