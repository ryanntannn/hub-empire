import React, { MutableRefObject, useRef } from 'react';
import { Button, Container } from 'reactstrap';
import BackButton from '../BackButton';
import useAuth from '../../contexts/AuthenticationContext';
import { Card } from '../../types/types';
import Loading from '../Loading';
import { DropdownSelection } from '../DropdownSelection';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';

export default function CardEditor() {
	const auth = useAuth();
	const [cards, setCards] = React.useState<any[] | null>(null);
	const [activeCard, setActiveCard] = React.useState<any | null>(null);
	let [editor, setEditor] = React.useState<JSONEditor | null>(null);

	const getCardBaseData = () => {
		auth.authenticatedGet(`/admin/cardbasedata`)
			.then((res: any) => {
				const cardBaseData = res.data;
				setCards(cardBaseData);
				setCard(cardBaseData[0]);
				console.log(cardBaseData);
			})
			.catch((err) => {});
	};

	const initJsonEditor = () => {
		setEditor(new JSONEditor(document.getElementById('jsoneditor')!, {}));
	};

	function setJson(newJson: any) {
		editor!.set(newJson);
	}

	function setCard(cardData: any) {
		console.log(cardData);
		setActiveCard(cardData);
		setJson(cardData);
	}

	function submitCard(cardData: any) {
		console.log(cardData);
		if (cardData.id == undefined) return;
		auth.authenticatedPost(`/admin/updatecard`, { data: { ...cardData } })
			.then((res) => {
				console.log('Card Updated!');
				getCardBaseData();
			})
			.catch((err) => console.error(err));
	}

	React.useEffect(() => {
		if (cards != null) return;
		getCardBaseData();
		initJsonEditor();
	}, [cards]);

	return (
		<div className='page'>
			<Container className='mt-5'>
				<h1 className='title'>Card Editor</h1>
				<BackButton />
				{cards != undefined ? (
					<>
						<DropdownSelection
							items={cards.map((card) => ({
								id: card.displayName,
								data: card,
							}))}
							setSelected={setCard}
						/>
					</>
				) : (
					<Loading />
				)}
				<div
					className='my-2'
					id='jsoneditor'
					style={{ width: '100%', height: 700 }}></div>

				<Button
					color='success'
					onClick={() => submitCard(editor!.get())}>
					Submit
				</Button>
			</Container>
		</div>
	);
}
