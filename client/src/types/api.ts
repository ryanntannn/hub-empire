import { ActionLog, CardType, UserData } from './types';

// GET /home
export interface GetHomeDataRes {
	myData: UserData;
}

//GET /my-cards
export interface GetMyCardsRes {
	cards: number[];
}

//GET /leaderboard
export interface GetLeaderboardRes {
	players: UserData[];
}

//GET /users-min
export interface GetUsersMinRes {
	users: UserData[];
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
	cardType?: CardType;
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
