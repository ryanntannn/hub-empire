import React from 'react';
import { Button, CardProps } from 'reactstrap';
import { TestCard } from '../MyCards';
import { CgDetailsLess, CgDetailsMore } from 'react-icons/cg';

import { AiFillDelete, AiOutlineSwap } from 'react-icons/ai';
import Card from '../Card';

export default function TradeInbox() {
	return (
		<div className='mt-3 mb-3'>
			<TradeOffer />
		</div>
	);
}

export function TradeOffer() {
	return (
		<div
			style={{ textAlign: 'center' }}
			className='rounded-box shadow mt-2 mb-2'>
			<h2 className='normal-and-bold'>
				🤝 Offer from Player1{' '}
				<Button color='primary'>View Offer</Button>{' '}
				<Button color='danger'>
					<AiFillDelete size={20} />
				</Button>
			</h2>
			<div>
				<TestCardMini />
				<TestCardMini />
				<div className='card mini' style={{ padding: '15px 0 15px' }}>
					<AiOutlineSwap />
				</div>
				<TestCardMini />
				<TestCardMini />
			</div>
		</div>
	);
}

function TestCardMini() {
	return (
		<CardMini
			emoji={'🏢'}
			displayName={'test card'}
			value={0}
			earnings={0}
			color={'#DD5555'}
		/>
	);
}

export function CardMini(props: CardProps) {
	return (
		<div className='shadow card mini'>
			<div
				className='top-color-area'
				style={{ backgroundColor: props.color }}></div>
			<h1
				style={{
					fontSize: 25,
				}}>
				{props.emoji}
			</h1>
		</div>
	);
}
