import React, { useEffect } from 'react';
import {
	ActionCard,
	Card,
	CardInstance,
	CardInstanceData,
	HubCard,
} from '../types/types';
import AxiosBase from '../utils/AxiosBase';
import useAuth from './AuthenticationContext';

export interface UseCards {
	init: () => void;
	getCard: (id: number) => ActionCard | HubCard;
	getCardInstance: (cardData: CardInstanceData) => CardInstance;
}

const CardContext = React.createContext<UseCards>(null!);

let cardDatabase: { [id: number]: ActionCard | HubCard } = {};

function useCards() {
	const auth = useAuth();

	const init = async () => {
		try {
			const res: any = await auth.authenticatedGet('/get-cards');
			cardDatabase = res.data!;
			console.log('inited cards!');
		} catch (err) {
			console.log(err);
		}
	};

	const getCard = (id: number) =>
		cardDatabase[id] != undefined ? cardDatabase[id] : cardDatabase[0];

	const getCardInstance = (cardData: CardInstanceData) => ({
		...cardData,
		card: getCard(cardData.cardId),
	});

	return { init, getCard, getCardInstance };
}

const CardProvider: React.FC = ({ children }) => {
	const cards: UseCards = useCards();
	const auth = useAuth();
	const [inited, setInited] = React.useState(false);

	React.useEffect(() => {
		if (auth.user.userData._id == -1 || inited) return;
		console.log(auth.user.userData._id);
		setInited(true);
		cards.init();
	}, [auth, cards]);

	return (
		<CardContext.Provider value={cards}>{children}</CardContext.Provider>
	);
};

export default function CardConsumer() {
	return React.useContext(CardContext);
}

export { CardProvider };
