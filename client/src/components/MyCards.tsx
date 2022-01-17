import { Col, Container, Row } from 'reactstrap';
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
		<div className='home page'>
			<Container className='mt-5'>
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
