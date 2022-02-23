import React, { useEffect } from 'react';
import { create, createModal, InstanceProps } from 'react-modal-promise';
import {
	Button,
	Col,
	Container,
	Input,
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
	UserDataMin,
} from '../types/types';
import BackButton from './BackButton';
import CardComponent from './Card';
import useAuth from '../contexts/AuthenticationContext';
import Loading from './Loading';
import useCards from '../contexts/CardsContext';

export default function MyCards() {
	const [cards, setCards] = React.useState<(ActionCard | HubCard)[] | null>(
		null
	);

	const auth = useAuth();

	const cardModal = create(ActiveCardModal);

	const cardsData = useCards();

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
						return cardsData.getCard(id);
					})
				);
			})
			.catch();
	});

	const getSpacers = () => {
		let returnMe = [];
		for (let i = 0; i < cards!.length % 3; i++) {
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
										onClick={async () => {
											try {
												cardModal({ currentCard: x });
											} catch (err) {}
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
		try {
			const card = props.currentCard as ActionCard;
			const data: PostUseCardParams = { cardId: card.id };
			if (card.isTargetPlayer) data.targetId = await targetPlayerModal();
			if (card.isTargetCard)
				data.targetCardId = await targetCardModal({
					playerId: data.targetId!,
				});
			if (card.isTargetSelfCard)
				data.selfCardId = await targetCardModal({ playerId: 0 });
			const params = { ...data };
			console.log(params);
			const res: any = await auth.authenticatedPost(`/use-card`, {
				...data,
			});
			console.log(res.data);
			return;
		} catch (err) {
			console.log(err);
		}
	}

	function ActiveActionCardDetails(currentCard: ActionCard) {
		return (
			<div>
				<p style={{ fontSize: 13 }}>
					<b>Tags:</b>
					<br />
					{currentCard.isTargetPlayer ? 'Targets Player' : ''}
					<br />
					{currentCard.isTargetCard ? 'Targets Player Card' : ''}
					<br />
					{currentCard.isTargetSelfCard ? 'Targets Self Card' : ''}
				</p>
			</div>
		);
	}

	function ActiveHubCardDetails(currentCard: HubCard) {
		return (
			<div>
				<p>
					Supply Chain Step: <b>{Step[currentCard.step]}</b>
					<br />
					Industry: <b>{Industry[currentCard.industry]}</b>
					<br />
					Value: <b>${currentCard.value}</b>
					<br />
					Income: <b>${currentCard.baseIncome}</b>
				</p>
			</div>
		);
	}

	return (
		<Modal isOpen={props.isOpen} style={{ maxWidth: 600 }}>
			<ModalHeader toggle={() => props.onReject()}>
				{props.currentCard.cardType == 0 ? 'Hub Card' : 'Action Card'}
			</ModalHeader>
			<ModalBody>
				<div className='card-details'>
					<CardComponent
						card={props.currentCard}
						onClick={() => {}}
					/>
					<div>
						<p
							style={{
								fontSize: 10,
								position: 'absolute',
								bottom: 0,
							}}>
							cardId:{props.currentCard.id}
						</p>
						<h2 className='big-and-bold'>
							{props.currentCard.emoji}{' '}
							{props.currentCard.displayName}
						</h2>
						<h6>
							<b>{CardRarity[props.currentCard.rarity]}</b> Card
						</h6>
						<p>{props.currentCard.description}</p>
						{props.currentCard.cardType == CardType.ACTION
							? ActiveActionCardDetails(
									props.currentCard as ActionCard
							  )
							: null}
						{props.currentCard.cardType == CardType.HUB
							? ActiveHubCardDetails(props.currentCard as HubCard)
							: null}
					</div>
				</div>
			</ModalBody>
			<ModalFooter>
				{props.currentCard.cardType == CardType.ACTION ? (
					<Button color='primary' onClick={useCard}>
						Use card
					</Button>
				) : null}
				{props.currentCard.cardType == CardType.HUB ? (
					<Button disabled color='primary'>
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
	const [playerList, setPlayerList] = React.useState<UserDataMin[] | null>(
		null
	);
	const [selectedPlayerId, setSelectedPlayerId] = React.useState<
		number | null
	>(null);

	const auth = useAuth();

	React.useEffect(() => {
		if (playerList != null) return;
		auth.authenticatedGet('/users-min')
			.then((res: any) => {
				setPlayerList(
					res.data.user
						.filter((x: any) => x._id != auth.user.userData.id)
						.map((x: any) => ({
							id: x._id,
							displayName: x.displayName,
						}))
				);
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	return (
		<Modal isOpen={props.isOpen} toggle={() => props.onReject()}>
			<ModalHeader toggle={() => props.onReject()}>
				<h2 className='big-and-bold'>Choose a target player</h2>
			</ModalHeader>
			<ModalBody style={{ textAlign: 'center' }}>
				{playerList != null ? (
					playerList.map((userData, i) => (
						<div key={i}>
							<Input
								onClick={() => {
									setSelectedPlayerId(userData.id);
								}}
								name={`radio-playerSelect`}
								type='radio'
							/>{' '}
							{userData.displayName}
						</div>
					))
				) : (
					<div style={{ height: 200 }}>
						<Loading />
					</div>
				)}
			</ModalBody>
			<ModalFooter>
				<Button
					disabled={selectedPlayerId == null}
					color='primary'
					onClick={() => props.onResolve(selectedPlayerId!)}>
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
	const [cardList, setCardList] = React.useState<number[] | null>(null);
	const [selectedCardId, setSelectedCardId] = React.useState<number | null>(
		null
	);
	const auth = useAuth();
	const cardsData = useCards();

	React.useEffect(() => {
		if (cardList != null) return;
		auth.authenticatedGet(`/user?id=${props.playerId}`)
			.then((res: any) => {
				setCardList(res.data.user.cardIds);
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	return (
		<Modal isOpen={props.isOpen} toggle={() => props.onReject()}>
			<ModalHeader toggle={() => props.onReject()}>
				<h2 className='big-and-bold'>Choose a card</h2>
			</ModalHeader>
			<ModalBody style={{ textAlign: 'center' }}>
				<div style={{ display: 'inline-block' }}>
					<div className='card-container small'>
						{cardList != null ? (
							cardList.map((card, i) => (
								<CardComponent
									card={cardsData.getCard(card)}
									onClick={() => {
										setSelectedCardId(card);
									}}
									selected={selectedCardId == card}
								/>
							))
						) : (
							<div style={{ height: 200 }}>
								<Loading />
							</div>
						)}
					</div>
				</div>
			</ModalBody>
			<ModalFooter>
				<Button
					disabled={selectedCardId == null}
					color='primary'
					onClick={() => props.onResolve(selectedCardId!)}>
					Confirm Selection
				</Button>
				<Button color='secondary' onClick={() => props.onReject()}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}
