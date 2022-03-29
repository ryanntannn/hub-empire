import { Container } from 'reactstrap';
import BackButton from './BackButton';

export default function NotFound() {
	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1>404 Not Found</h1>
			</Container>
		</div>
	);
}
