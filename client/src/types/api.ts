import {
	ActionLog,
	TradeOffer,
	UserData,
	UserDataBasic,
	UserDataMin,
} from './types';

// GET /home
export interface GetHomeDataRes {
	myData: UserDataBasic;
}

//GET /my-cards
export interface GetMyCardsRes {
	cards: number[];
}

//GET /leaderboard
export interface GetLeaderboardRes {
	users: UserDataBasic[];
}

//GET /users-min
export interface GetUsersMinRes {
	users: UserDataMin[];
}

//GET /user
export interface GetUserDataRes {
	user: UserData;
}

//POST /use-card
export interface PostUseCardParams {
	cardId: number;
	instanceId: number;
	targetId?: number;
	targetCardId?: number;
	selfCardId?: number;
}

//GET /action-log
export interface GetActionLogParams {
	gameId: string;
	showAmount: number;
	page: number;
}
export interface GetActionLogRes {
	log: ActionLog[];
}

//POST /send-trade
export interface PostSendTradeParams {
	idTo: number;
	cardIdsFrom: number[];
	cashFrom: number;
	cardIdsTo: number[];
	cashTo: number;
}

//GET /trade/inbox & /trade/history
export interface GetTradeInboxParams {
	showAmount: number; // e.g. show 5 in one page
	page: number; //page number
}
export interface GetTradeInboxRes {
	trades: TradeOffer[];
	pages: number; //total number of pages
}

//POST /trade/action
export interface PostAcceptTradeParams {
	id: number;
	accept: boolean;
}
