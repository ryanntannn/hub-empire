import { Col, Container, Row } from 'reactstrap';
import BackButton from './BackButton';
import Card from './Card';

export default function MyCards() {
	const TestCard = () => (
		<Card
			emoji={'🏢'}
			displayName={'test card'}
			value={0}
			returns={0}
			color={'#DD5555'}
		/>
	);
	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>🏢 My Cards</h1>
				<Container fluid className='mt-5 '>
					<Row className='mt-3 gx-3'>
						<Col>
							<TestCard />
						</Col>
						<Col>
							<TestCard />
						</Col>
					</Row>
					<Row className='mt-3 gx-3'>
						<Col>
							<TestCard />
						</Col>
						<Col>
							<TestCard />
						</Col>
					</Row>
					<Row className='mt-3 gx-3'>
						<Col>
							<TestCard />
						</Col>
						<Col>
							<TestCard />
						</Col>
					</Row>
				</Container>
			</Container>
		</div>
	);
}
