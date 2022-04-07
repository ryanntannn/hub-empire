import { CardRarity } from './types';

export type RewardTemplate = Map<CardRarity, number>;

export interface Metric {
	id: string;
	displayName: string;
	maxScore: number;
	scoreBasedRewards: {
		score: number;
		rewards: RewardData[];
	}[];
	positionBasedRewards: {
		position: number;
		rewards: RewardData[];
	}[];
}

export interface ScoreData {
	_id: string;
	displayName: string;
	score: number;
	rewards?: RewardData[];
}

export interface RewardData {
	rarity: CardRarity;
	amount: number;
}
[];

export interface TestResults {
	metricId: string;
	results: {
		playerId: string;
		result: number;
	};
}
