import { Col, Container, Row } from 'reactstrap';
import { CardRarity, CardType, Industry, Step } from '../types/types';
import BackButton from './BackButton';
import Card from './Card';

export function TestCard() {
	return (
		<Card
			card={{
				id: 0,
				emoji: '🏢',
				displayName: 'test',
				description: 'test',
				cardType: CardType.HUB,
				rarity: CardRarity.COMMON,
				value: 10,
				baseIncome: 1,
				industry: Industry.FOOD,
				step: Step.DISTRIBUTER,
			}}
		/>
	);
}

export function TestActionCard() {
	return (
		<Card
			card={{
				id: 0,
				emoji: '🏢',
				displayName: 'action',
				description: 'test',
				cardType: CardType.ACTION,
				rarity: CardRarity.COMMON,
				isTargetCard: false,
				isTargetPlayer: false,
				isTargetSelfCard: false,
			}}
		/>
	);
}

export default function MyCards() {
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
							<TestActionCard />
						</Col>
						<Col xs='auto'>
							<TestActionCard />
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
