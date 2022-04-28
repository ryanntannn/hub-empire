import React from 'react';
import {
	Button,
	Col,
	Container,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Row,
} from 'reactstrap';
import BackButton from '../BackButton';
import useAuth from '../../contexts/AuthenticationContext';
import { BiEdit } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export default function NewTrade() {
	const auth = useAuth();
	const navigate = useNavigate();

	return (
		<div className='rounded-box shadow mt-3 mb-5'>
			<h2 className='big-and-bold'>🤝 New Trade Offer</h2>
			<h4>
				<BiEdit size={20} />
			</h4>
			<div className='mt-3 mb-5 scroll-y'></div>
			<h4>
				<TradeOfferDropdown />
				's Cards <BiEdit size={20} />
			</h4>
			<div className='mt-3 mb-3 scroll-y'></div>
			<Button color='success' className='mb-2'>
				Send Trade Offer
			</Button>
			<br></br>
			<Button
				color='danger'
				onClick={() => navigate('/trade', { replace: true })}>
				Cancel
			</Button>
		</div>
	);
}

function TradeOfferDropdown() {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<Dropdown
			style={{ display: 'inline' }}
			toggle={() => {
				setIsOpen((x) => !x);
			}}
			isOpen={isOpen}>
			<DropdownToggle caret>Player 1</DropdownToggle>
			<DropdownMenu container='body'>
				<DropdownItem onClick={function noRefCheck() {}}>
					Action 1
				</DropdownItem>
				<DropdownItem onClick={function noRefCheck() {}}>
					Action 2
				</DropdownItem>
				<DropdownItem onClick={function noRefCheck() {}}>
					Action 3
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
