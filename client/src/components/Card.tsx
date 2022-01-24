import { Button } from 'reactstrap';
import { ActionCard, CardType, HubCard, Industry } from '../types/types';

function IndustryToColor(industry: Industry) {
	switch (industry) {
		case Industry.FOOD:
			return 'green';
		case Industry.TECH:
			return 'blue';
		case Industry.CLOTHES:
			return 'red';
	}
}

export default function CardComponent(props: { card: HubCard | ActionCard }) {
	return props.card.cardType == CardType.ACTION ? (
		<ActionCardComponent card={props.card as ActionCard} />
	) : (
		<HubCardComponent card={props.card as HubCard} />
	);
}

function ActionCardComponent(props: { card: ActionCard }) {
	return (
		<div className='rounded-box shadow card'>
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
			<p className='normal-and-bold no-padding'>
				{props.card.displayName}
			</p>
			<Button className='mt-3'>use card</Button>
		</div>
	);
}

function HubCardComponent(props: { card: HubCard }) {
	return (
		<div className='rounded-box shadow card'>
			<div
				className='top-color-area'
				style={{
					backgroundColor: IndustryToColor(props.card.industry),
				}}></div>
			<h1
				style={{
					fontSize: 50,
				}}>
				{props.card.emoji}
			</h1>
			<p className='normal-and-bold no-padding'>
				{props.card.displayName}
			</p>
			<p className='normal-and-bold no-padding'>${props.card.value}</p>
			<p
				style={{ color: props.card.baseIncome >= 0 ? 'green' : 'red' }}
				className='normal-and-bold no-padding'>
				{props.card.baseIncome >= 0 ? '+' : '-'}${props.card.baseIncome}
			</p>
		</div>
	);
}
