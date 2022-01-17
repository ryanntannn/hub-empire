import { Col, Container, Row } from 'reactstrap';
import BackButton from './BackButton';
import Card from './Card';

export default function MyCards() {
	const TestCard = () => (
		<Card
			emoji={'🏢'}
			displayName={'test card'}
			value={0}
			earnings={0}
			color={'#DD5555'}
		/>
	);
	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>🏢 My Cards</h1>
				<Container fluid className='mt- '>
					<Row className='mt-3 gy-3'>
						<Col xs='auto'>
							<TestCard />
						</Col>
						<Col xs='auto'>
							<TestCard />
						</Col>
						<Col xs='auto'>
							<TestCard />
						</Col>
						<Col xs='auto'>
							<TestCard />
						</Col>
						<Col xs='auto'>
							<TestCard />
						</Col>
					</Row>
				</Container>
			</Container>
		</div>
	);
}
