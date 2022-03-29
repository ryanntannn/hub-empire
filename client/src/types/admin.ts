import { CardRarity } from './types';

export type RewardTemplate = Map<CardRarity, number>;

export interface Metric {
	id: string;
	displayName: string;
	maxScore: number;
	scoreBasedRewards: Map<number, RewardTemplate>;
	positionBasedRewards: Map<number, RewardTemplate>;
}

export interface TestResults {
	metricId: string;
	results: {
		playerId: string;
		result: number;
	};
}
