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
	CardInstance,
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
	const [cards, setCards] = React.useState<CardInstance[] | null>(null);

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
				const cardIds: { instanceId: number; cardId: number }[] =
					res.data.cards;
				console.log(cardIds);
				setCards(
					cardIds.map((id) => {
						return cardsData.getCardInstance(id);
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
										card={x.card}
										onClick={async () => {
											try {
												cardModal({ cardInstance: x });
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
	cardInstance: CardInstance;
}

function ActiveCardModal(props: CardModalProps) {
	const auth = useAuth();

	const targetPlayerModal = create(ChooseTargetPlayer);
	const targetCardModal = create(ChooseTargetCard);
	const acknowledgementModal = create(AcknowledgementModal);

	async function useCard() {
		try {
			const card = props.cardInstance.card as ActionCard;
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
			await acknowledgementModal({
				msg: res.data.toString(),
				success: true,
			});
			return;
		} catch (err: any) {
			await acknowledgementModal({ msg: err.toString(), success: false });
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
				{props.cardInstance.card.cardType == 0
					? 'Hub Card'
					: 'Action Card'}
			</ModalHeader>
			<ModalBody>
				<div className='card-details'>
					<CardComponent
						card={props.cardInstance.card}
						onClick={() => {}}
					/>
					<div>
						<p
							style={{
								fontSize: 10,
								position: 'absolute',
								bottom: 0,
							}}>
							cardId: {props.cardInstance.card.id}, instanceId:{' '}
							{props.cardInstance.instanceId}
						</p>
						<h2 className='big-and-bold'>
							{props.cardInstance.card.emoji}{' '}
							{props.cardInstance.card.displayName}
						</h2>
						<h6>
							<b>{CardRarity[props.cardInstance.card.rarity]}</b>{' '}
							Card
						</h6>
						<p>{props.cardInstance.card.description}</p>
						{props.cardInstance.card.cardType == CardType.ACTION
							? ActiveActionCardDetails(
									props.cardInstance.card as ActionCard
							  )
							: null}
						{props.cardInstance.card.cardType == CardType.HUB
							? ActiveHubCardDetails(
									props.cardInstance.card as HubCard
							  )
							: null}
					</div>
				</div>
			</ModalBody>
			<ModalFooter>
				{props.cardInstance.card.cardType == CardType.ACTION ? (
					<Button color='primary' onClick={useCard}>
						Use card
					</Button>
				) : null}
				{props.cardInstance.card.cardType == CardType.HUB ? (
					<Button disabled color='primary'>
						Sell card for $
						{(props.cardInstance.card as HubCard).value}
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
	const [cardList, setCardList] = React.useState<
		{ instanceId: number; cardId: number }[] | null
	>(null);
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
					<div
						className='card-container small scroll-y'
						style={{ maxHeight: 400, paddingRight: 30 }}>
						{cardList != null ? (
							cardList.map((card, i) => (
								<CardComponent
									card={cardsData.getCard(card.cardId)}
									onClick={() => {
										setSelectedCardId(card.instanceId);
									}}
									selected={selectedCardId == card.instanceId}
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

interface AcknowledgementModalProps extends InstanceProps<null, null> {
	msg: string;
	success: boolean;
}

function AcknowledgementModal(props: AcknowledgementModalProps) {
	return (
		<Modal isOpen={props.isOpen} toggle={() => props.onResolve()}>
			<ModalHeader toggle={() => props.onReject()}>
				<h2 className='big-and-bold'>
					{props.success ? 'Success' : 'Failed'}
				</h2>
			</ModalHeader>
			<ModalBody style={{ textAlign: 'center' }}>{props.msg}</ModalBody>
			<ModalFooter>
				<Button color='secondary' onClick={() => props.onResolve()}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}
