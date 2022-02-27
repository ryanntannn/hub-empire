import { Spinner } from 'reactstrap';

export default function Loading() {
	return (
		<div
			style={{
				position: 'absolute',
				top: '50%',
				right: '50%',
				transform: 'translate(50%,-50%)',
			}}>
			<Spinner />
		</div>
	);
}
