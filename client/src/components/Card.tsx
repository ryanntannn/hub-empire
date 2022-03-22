import { Button } from 'reactstrap';
import {
	ActionCard,
	Card,
	CardInstance,
	CardRarity,
	CardType,
	HubCard,
	HubType,
	Step,
} from '../types/types';
import { numberWithCommas } from '../utils/Misc';

function HubTypeToColor(type: HubType) {
	switch (type) {
		case HubType.AIRPORT:
			return '#ECC30B';
		case HubType.SEAPORT:
			return '#84BCDA';
		case HubType.WAREHOUSE:
			return '#F37748';
		case HubType.DISTRIBUTION:
			return '#e84898';
	}
}

function RarityToColor(rarity: CardRarity) {
	switch (rarity) {
		case CardRarity.COMMON:
			return '#505050';
		case CardRarity.RARE:
			return '#5050bb';
		case CardRarity.EPIC:
			return '#bb50aa';
		case CardRarity.LEGENDARY:
			return '#ee9050';
	}
}

function RarityToBgColor(rarity: CardRarity) {
	switch (rarity) {
		case CardRarity.COMMON:
			return '#ffffff';
		case CardRarity.RARE:
			return '#ddddff';
		case CardRarity.EPIC:
			return '#eeddff';
		case CardRarity.LEGENDARY:
			return '#ffeedd';
	}
}

export default function CardComponent(props: {
	cardInstance: CardInstance;
	onClick: () => void;
	selected?: boolean;
}) {
	return props.cardInstance.card.cardType == CardType.ACTION ? (
		<ActionCardComponent
			card={props.cardInstance.card as ActionCard}
			onClick={props.onClick}
			selected={props.selected}
		/>
	) : (
		<HubCardComponent
			cardInstance={props.cardInstance as CardInstance}
			onClick={props.onClick}
			selected={props.selected}
		/>
	);
}

function ActionCardComponent(props: {
	card: ActionCard;
	onClick: () => void;
	selected?: boolean;
}) {
	return (
		<div
			className={`rounded-box shadow card ${
				props.selected ? 'selected' : null
			}`}
			onClick={props.onClick}
			style={{
				backgroundColor: RarityToBgColor(props.card.rarity),
			}}>
			<div
				className='top-color-area'
				style={{
					backgroundColor: 'none',
				}}></div>
			<h1
				style={{
					fontSize: 50,
				}}>
				{props.card.emoji}
			</h1>
			<p
				style={{
					color: RarityToColor(props.card.rarity),
				}}
				className='normal-and-bold no-padding'>
				{props.card.displayName}
			</p>
			<p className='no-padding mt-2'>{props.card.description}</p>
		</div>
	);
}

function HubCardComponent(props: {
	cardInstance: CardInstance;
	onClick: () => void;
	selected?: boolean;
}) {
	const card = props.cardInstance.card as HubCard;
	const isRepurposed: boolean =
		props.cardInstance.modifiers.hub.newHubType != undefined;
	const hubType: HubType = (
		isRepurposed
			? props.cardInstance.modifiers.hub.newHubType
			: card.hubType
	)!;
	return (
		<div
			className={`rounded-box shadow card ${
				props.selected ? 'selected' : null
			}`}
			onClick={props.onClick}
			style={{
				backgroundColor: RarityToBgColor(card.rarity),
			}}>
			<div
				className='top-color-area'
				style={{
					padding: 10,
					color: 'rgba(0,0,0,0.5)',
					backgroundColor: HubTypeToColor(hubType),
				}}>
				{isRepurposed ? <b>REPURPOSED</b> : null}
			</div>
			<h1
				style={{
					fontSize: 50,
				}}>
				{card.emoji}
			</h1>
			<p
				style={{
					color: RarityToColor(card.rarity),
				}}
				className='normal-and-bold no-padding'>
				{card.displayName}
			</p>
			<p className='normal-and-bold no-padding mt-2'>
				${numberWithCommas(card.value)}M
			</p>
			<p
				style={{
					color:
						props.cardInstance.effectiveIncome >= 0
							? 'green'
							: 'red',
				}}
				className='normal-and-bold no-padding mt-2'>
				{props.cardInstance.effectiveIncome >= 0 ? '+' : '-'}$
				{numberWithCommas(Math.abs(props.cardInstance.effectiveIncome))}
				M
			</p>
		</div>
	);
}
