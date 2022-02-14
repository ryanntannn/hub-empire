import React from 'react';
import { create, createModal, InstanceProps } from 'react-modal-promise';
import {
	Button,
	Col,
	Container,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
} from 'reactstrap';
import { GetMyCardsRes, PostUseCardParams } from '../types/api';
import {
	ActionCard,
	CardRarity,
	CardType,
	HubCard,
	Industry,
	Step,
} from '../types/types';
import BackButton from './BackButton';
import CardComponent from './Card';
import useAuth from '../contexts/AuthenticationContext';
import Loading from './Loading';
import Cards from '../types/cards';

const dummyData: (ActionCard | HubCard)[] = [
	{
		id: 0,
		emoji: '🏢',
		displayName: 'action',
		description: 'test',
		cardType: CardType.ACTION,
		rarity: CardRarity.COMMON,
		isTargetCard: false,
		isTargetPlayer: true,
		isTargetSelfCard: false,
	},
	{
		id: 0,
		emoji: '🏢',
		displayName: 'hub',
		description: 'test',
		cardType: CardType.HUB,
		rarity: CardRarity.COMMON,
		value: 10,
		baseIncome: 1,
		step: Step.DISTRIBUTER,
		industry: Industry.CLOTHES,
	},
	{
		id: 0,
		emoji: '🏢',
		displayName: 'hub',
		description: 'test',
		cardType: CardType.HUB,
		rarity: CardRarity.COMMON,
		value: 10,
		baseIncome: 1,
		step: Step.DISTRIBUTER,
		industry: Industry.CLOTHES,
	},
	{
		id: 0,
		emoji: '🏢',
		displayName: 'hub',
		description: 'test',
		cardType: CardType.HUB,
		rarity: CardRarity.COMMON,
		value: 10,
		baseIncome: 1,
		step: Step.DISTRIBUTER,
		industry: Industry.CLOTHES,
	},
	{
		id: 0,
		emoji: '🏢',
		displayName: 'hub',
		description: 'test',
		cardType: CardType.HUB,
		rarity: CardRarity.COMMON,
		value: 10,
		baseIncome: 1,
		step: Step.DISTRIBUTER,
		industry: Industry.CLOTHES,
	},
];

export default function MyCards() {
	const [cards, setCards] = React.useState<(ActionCard | HubCard)[] | null>(
		null
	);

	const auth = useAuth();

	const cardModal = create(ActiveCardModal);

	const getCardData = async () => {
		auth.authenticatedGet('/my-cards')
			.then((res: any) => {
				console.log(res);
				return res;
			})
			.catch((err) => {
				console.log(err);
			});
	};

	React.useEffect(() => {
		if (cards != null) return;
		auth.authenticatedGet('/my-cards')
			.then((res: any) => {
				if (res == null) return;
				const cardIds: number[] = res.data.cards;
				setCards(
					cardIds.map((id) => {
						const thisCard = Cards[id];
						if (thisCard == undefined) return Cards[0];
						return Cards[id];
					})
				);
			})
			.catch();
	});

	const getSpacers = () => {
		let returnMe = [];
		for (let i = 0; i < dummyData.length % 3; i++) {
			returnMe.push(<Col key={-i} />);
		}
		return returnMe;
	};

	return (
		<div className='page'>
			{cards != null || false ? (
				<Container className='mt-5'>
					<BackButton />
					<h1 className='title'>🏢 My Cards</h1>
					<div className='mt-3 card-container'>
						{cards!.map((x, i) => {
							return (
								<Col key={i}>
									<CardComponent
										card={x}
										onClick={() => {
											cardModal({ currentCard: x });
										}}
									/>
								</Col>
							);
						})}
						{getSpacers()}
					</div>
				</Container>
			) : (
				<Loading />
			)}
		</div>
	);
}

interface CardModalProps extends InstanceProps<null, null> {
	currentCard: ActionCard | HubCard;
}

function ActiveCardModal(props: CardModalProps) {
	const auth = useAuth();

	const targetPlayerModal = create(ChooseTargetPlayer);
	const targetCardModal = create(ChooseTargetCard);

	async function useCard() {
		const card = props.currentCard as ActionCard;
		const data: PostUseCardParams = { cardId: card.id };
		if (card.isTargetPlayer) data.targetId = await targetPlayerModal();
		if (card.isTargetPlayer)
			data.targetCardId = await targetCardModal({
				playerId: data.targetId!,
			});
		if (card.isTargetPlayer)
			data.selfCardId = await targetCardModal({ playerId: 0 });
		return;
	}

	return (
		<Modal isOpen={props.isOpen}>
			<ModalHeader toggle={() => props.onReject()}>
				<h2 className='big-and-bold'>
					{props.currentCard.displayName}
				</h2>
			</ModalHeader>
			<ModalBody style={{ textAlign: 'center' }}>
				<CardComponent card={props.currentCard} onClick={() => {}} />
				<br />
				{props.currentCard.description}
			</ModalBody>
			<ModalFooter>
				{props.currentCard.cardType == CardType.ACTION ? (
					<Button color='primary' onClick={useCard}>
						Use card
					</Button>
				) : null}
				{props.currentCard.cardType == CardType.HUB ? (
					<Button color='primary'>
						Sell card for ${(props.currentCard as HubCard).value}
					</Button>
				) : null}
				<Button color='secondary' onClick={() => props.onReject()}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}

interface TargetPlayerProps extends InstanceProps<number, null> {}

function ChooseTargetPlayer(props: TargetPlayerProps) {
	return (
		<Modal isOpen={props.isOpen} toogle={() => props.onReject()}>
			<ModalHeader toggle={() => props.onReject()}>
				<h2 className='big-and-bold'>Choose a target player</h2>
			</ModalHeader>
			<ModalBody style={{ textAlign: 'center' }}></ModalBody>
			<ModalFooter>
				<Button color='primary' onClick={() => props.onResolve(0)}>
					Confirm Selection
				</Button>
				<Button color='secondary' onClick={() => props.onReject()}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}

interface TargetCardProps extends InstanceProps<number, null> {
	playerId: number;
}

function ChooseTargetCard(props: TargetCardProps) {
	return (
		<Modal isOpen={props.isOpen} toogle={() => props.onReject()}>
			<ModalHeader toggle={() => props.onReject()}>
				<h2 className='big-and-bold'>Choose a card</h2>
			</ModalHeader>
			<ModalBody style={{ textAlign: 'center' }}></ModalBody>
			<ModalFooter>
				<Button color='primary' onClick={() => props.onResolve(0)}>
					Confirm Selection
				</Button>
				<Button color='secondary' onClick={() => props.onReject()}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}
