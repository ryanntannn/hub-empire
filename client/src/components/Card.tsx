import { Button } from 'reactstrap';
import {
	ActionCard,
	Card,
	CardRarity,
	CardType,
	HubCard,
	Industry,
	Step,
} from '../types/types';
import { numberWithCommas } from '../utils/Misc';

function IndustryToColor(industry: Industry) {
	switch (industry) {
		case Industry.FOOD:
			return '#ECC30B';
		case Industry.TECH:
			return '#84BCDA';
		case Industry.CLOTHES:
			return '#F37748';
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
	card: Card;
	onClick: () => void;
	selected?: boolean;
}) {
	return props.card.cardType == CardType.ACTION ? (
		<ActionCardComponent
			card={props.card as ActionCard}
			onClick={props.onClick}
			selected={props.selected}
		/>
	) : (
		<HubCardComponent
			card={props.card as HubCard}
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
	card: HubCard;
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
					backgroundColor: IndustryToColor(props.card.industry),
				}}>
				<div className='step'>
					{Industry[props.card.industry]} {Step[props.card.step]}
				</div>
			</div>
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
			<p className='normal-and-bold no-padding mt-2'>
				${numberWithCommas(props.card.value)}M
			</p>
			<p
				style={{ color: props.card.baseIncome >= 0 ? 'green' : 'red' }}
				className='normal-and-bold no-padding mt-2'>
				{props.card.baseIncome >= 0 ? '+' : '-'}$
				{numberWithCommas(Math.abs(props.card.baseIncome))}M
			</p>
		</div>
	);
}
