import React, { useEffect } from 'react';
import { create, createModal, InstanceProps } from 'react-modal-promise';
import {
	Button,
	Col,
	Container,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
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
	CardInstanceData,
	CardRarity,
	CardType,
	HubCard,
	HubModifier,
	HubType,
	IncomeModifier,
	Step,
	UserData,
} from '../types/types';
import BackButton from './BackButton';
import CardComponent from './Card';
import useAuth from '../contexts/AuthenticationContext';
import Loading from './Loading';
import useCards from '../contexts/CardsContext';
import { enumToArray } from '../utils/Misc';

interface SortMethod {
	name: string;
	method: (a: CardInstance, b: CardInstance) => number;
}

export default function MyCards() {
	const [cards, setCards] = React.useState<CardInstance[] | null>(null);

	const auth = useAuth();

	const cardModal = create(ActiveCardModal);

	const cardsData = useCards();

	const sortMethods: {
		name: string;
		method: (a: CardInstance, b: CardInstance) => number;
	}[] = [
		{
			name: 'Recent',
			method: (a, b) => {
				return a.instanceId! < b.instanceId! ? 1 : -1;
			},
		},
		{
			name: 'Sort A to Z',
			method: (a, b) => {
				return a.card.displayName > b.card.displayName ? 1 : -1;
			},
		},
		{
			name: 'Sort Z to A',
			method: (a, b) => {
				return a.card.displayName < b.card.displayName ? 1 : -1;
			},
		},
		{
			name: 'Sort by Rarity',
			method: (a, b) => {
				return a.card.rarity < b.card.rarity ? 1 : -1;
			},
		},
		{
			name: 'Sort by Value',
			method: (a, b) => {
				if (a.card.cardType == 1) return 1;
				if (b.card.cardType == 1) return -1;
				return (a.card as HubCard).value < (b.card as HubCard).value
					? 1
					: -1;
			},
		},
		{
			name: 'Sort by Hub Type',
			method: (a, b) => {
				if (a.card.cardType == 1) return 1;
				if (b.card.cardType == 1) return -1;
				return (a.card as HubCard).hubType > (b.card as HubCard).hubType
					? 1
					: -1;
			},
		},
	];

	const errorCardsToTheBack = (a: CardInstance, b: CardInstance) => {
		if (a.card.id == 0) return 1;
		if (b.card.id == 0) return -1;
		return 1;
	};

	const [activeSortMethod, setActiveSortMethod] = React.useState<SortMethod>(
		sortMethods[0]
	);

	function getCards() {
		auth.authenticatedGet('/my-cards')
			.then((res: any) => {
				if (res == null) return;
				console.log(res);
				const cardIds: CardInstanceData[] = res.data.cards;
				console.log(cardIds);
				setCards(
					cardIds.map((id) => {
						return cardsData.getCardInstance(id);
					})
				);
			})
			.catch();
	}

	React.useEffect(() => {
		if (cards != null) return;
		getCards();
	});

	const getSpacers = () => {
		let returnMe = [];
		for (let i = 0; i < cards!.length % 3; i++) {
			returnMe.push(<Col key={-i} />);
		}
		return returnMe;
	};

	function SortDropdown() {
		const [isOpen, setIsOpen] = React.useState(false);
		return (
			<Dropdown
				style={{ display: 'inline' }}
				toggle={() => {
					setIsOpen((x) => !x);
				}}
				isOpen={isOpen}
				color='secondary'>
				<DropdownToggle caret>{activeSortMethod.name}</DropdownToggle>
				<DropdownMenu container='body'>
					{sortMethods.map((sortMethod, i) => (
						<DropdownItem
							key={i}
							onClick={() => setActiveSortMethod(sortMethod)}>
							{sortMethod.name}
						</DropdownItem>
					))}
				</DropdownMenu>
			</Dropdown>
		);
	}

	return (
		<div className='page'>
			<Container className='mt-5'>
				<BackButton />
				<h1 className='title'>🏢 My Cards</h1>
				<SortDropdown />

				{cards != null || false ? (
					<div className='mt-3 card-container'>
						{cards
							.sort(activeSortMethod.method)
							.sort(errorCardsToTheBack)
							.map((x, i) => {
								return (
									<Col key={i}>
										<CardComponent
											key={i}
											cardInstance={x}
											onClick={async () => {
												try {
													cardModal({
														cardInstance: x,
														getCards,
													});
												} catch (err) {}
											}}
										/>
									</Col>
								);
							})}
						{getSpacers()}
					</div>
				) : (
					<Loading />
				)}
			</Container>
		</div>
	);
}

interface CardModalProps extends InstanceProps<null, null> {
	cardInstance: CardInstance;
	getCards: () => void;
}

function ActiveCardModal(props: CardModalProps) {
	const auth = useAuth();

	const targetPlayerModal = create(ChooseTargetPlayer);
	const targetCardModal = create(ChooseTargetCard);
	const targetHubTypeModal = create(ChooseHubType);
	const acknowledgementModal = create(AcknowledgementModal);

	async function useCard() {
		try {
			const card = props.cardInstance.card as ActionCard;
			console.log(card);
			const data: PostUseCardParams = {
				cardId: card.id,
				instanceId: props.cardInstance.instanceId,
			};
			if (card.isTargetPlayer) data.targetId = await targetPlayerModal();
			if (card.isTargetCard)
				data.targetCardId = await targetCardModal({
					playerId: data.targetId!,
				});
			if (card.isTargetSelfCard)
				data.selfCardId = await targetCardModal({ playerId: 0 });
			if (card.isTargetHubType)
				data.cardType = await targetHubTypeModal();
			const params = { ...data };
			console.log(params);
			const res: any = await auth.authenticatedPost(`/use-card`, {
				...data,
			});
			await acknowledgementModal({
				msg: res.data.toString(),
				success: true,
			});
			props.getCards();
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
					<br />
					Industry: <b>{HubType[currentCard.hubType]}</b>
					<br />
					Value: <b>${currentCard.value}M</b>
					<br />
					Income: <b>${currentCard.baseIncome}M</b>
				</p>
			</div>
		);
	}

	function renderModifiers() {
		console.log(props.cardInstance);
		const mods = props.cardInstance.modifiers;
		return (
			<div>
				<b>Active Effects:</b>
				{mods.hub.newHubType == undefined && mods.income.length <= 0 ? (
					<>
						<br />
						No Active Effects
					</>
				) : (
					''
				)}
				{renderHubModifiers(mods.hub)}
				{renderIncomeModifiers(mods.income)}
			</div>
		);
	}

	function renderHubModifiers(hubMods: HubModifier) {
		if (hubMods.newHubType == undefined) return null;
		return (
			<div className='rounded-box short shadow'>
				Hub has been repurposed to{' '}
				{HubType[hubMods.newHubType! as HubType]}
			</div>
		);
	}

	function renderIncomeModifiers(incomeMods: IncomeModifier[]) {
		return incomeMods.map((mod, i) => (
			<div className='rounded-box short shadow' key={i}>
				Income is {mod.incomeBoost > 0 ? 'increased' : 'decreased'} by{' '}
				{<b>{mod.incomeBoost}x</b>} (
				{mod.isPermanent ? 'Permanent' : `Turns Left: ${mod.turnsLeft}`}
				)
			</div>
		));
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
					<CardComponent cardInstance={props.cardInstance} />
					<div>
						{/* <p
							style={{
								fontSize: 10,
								position: 'absolute',
								bottom: 0,
							}}>
							cardId: {props.cardInstance.card.id}, instanceId:{' '}
							{props.cardInstance.instanceId}
						</p> */}
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
						{props.cardInstance.card.cardType == CardType.HUB
							? renderModifiers()
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
				<Button color='secondary' onClick={() => props.onReject()}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}

interface TargetPlayerProps extends InstanceProps<number, null> {}

function ChooseTargetPlayer(props: TargetPlayerProps) {
	const [playerList, setPlayerList] = React.useState<UserData[] | null>(null);
	const [selectedPlayerId, setSelectedPlayerId] = React.useState<
		number | null
	>(null);

	const auth = useAuth();

	React.useEffect(() => {
		if (playerList != null) return;
		auth.authenticatedGet('/users-min')
			.then((res: any) => {
				console.log(res);
				setPlayerList(
					res.data.user.filter(
						(x: any) => x._id != auth.user.userData._id
					)
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
									setSelectedPlayerId(userData._id);
								}}
								name={`radio-playerSelect`}
								type='radio'
							/>{' '}
							{userData.profile!.displayName}
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
	const [cards, setCards] = React.useState<CardInstance[] | null>(null);
	const [selectedCardId, setSelectedCardId] = React.useState<number | null>(
		null
	);
	const auth = useAuth();
	const cardsData = useCards();

	React.useEffect(() => {
		if (cards != null) return;
		let id = props.playerId;
		if (id == 0) id = auth.user.userData._id;
		auth.authenticatedGet(`/my-cards?id=${id}`)
			.then((res: any) => {
				if (res == null) return;
				console.log(res);
				const cardIds: CardInstanceData[] = (
					res.data.cards as CardInstanceData[]
				).filter(
					(x) => cardsData.getCard(x.cardId).cardType == CardType.HUB
				);
				setCards(
					cardIds.map((id) => {
						return cardsData.getCardInstance(id);
					})
				);
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	return (
		<Modal isOpen={props.isOpen} toggle={() => props.onReject()}>
			<ModalHeader as='h2' toggle={() => props.onReject()}>
				<h2 className='big-and-bold'>Choose a card</h2>
			</ModalHeader>
			<ModalBody style={{ textAlign: 'center' }}>
				<div style={{ display: 'inline-block' }}>
					<div
						className='card-container small scroll-y'
						style={{ maxHeight: 400 }}>
						{cards != null ? (
							cards.map((card, i) => (
								<CardComponent
									key={i}
									cardInstance={card}
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

interface HubTypeProps extends InstanceProps<HubType, null> {}

function ChooseHubType(props: HubTypeProps) {
	const [selectedHubType, setSelectedHubType] =
		React.useState<HubType | null>(null);
	return (
		<Modal isOpen={props.isOpen} toggle={() => props.onReject()}>
			<ModalHeader toggle={() => props.onReject()}>
				<h2 className='big-and-bold'>Choose a target player</h2>
			</ModalHeader>
			<ModalBody style={{ textAlign: 'center' }}>
				{enumToArray(HubType).map((hubType, i) => (
					<div key={i}>
						<Input
							onClick={() => {
								setSelectedHubType(i as HubType);
							}}
							name={`radio-hubSelect`}
							type='radio'
						/>{' '}
						{hubType}
					</div>
				))}
			</ModalBody>
			<ModalFooter>
				<Button
					disabled={selectedHubType == null}
					color='primary'
					onClick={() => props.onResolve(selectedHubType!)}>
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
