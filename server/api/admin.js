const queries = require('./../queries/queries');
const jwt = require('jsonwebtoken');
const express = require('express');
const { getMetric } = require('./../queries/queries');
const router = express.Router();
const cardUtils = require('../utils/cardUtils');
const deck = require('../api/cards');
const Player = require('../game/player');

// middleware to authenticate if user is an admin
async function authenticateAdmin(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		if (!user.isAdmin) return res.sendStatus(403);
		req.user = user;
		req.token = token;
		next();
	});
}

async function adminMetrics(req, res) {
	try {
		const game = await queries.getGameByGameId(req.user.gameId);
		if (game == undefined) return res.status(404).json('Game not found');
		return res.json(game.metrics);
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function testResultData(req, res) {
	try {
		const game = await queries.getGameByGameId(req.user.gameId);
		const users = await queries.getLeaderboard(req.user.gameId);
		if (game == undefined || users == undefined)
			return res.status(404).json('Game not found');
		return res.json({ metrics: game.metrics, users });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function updateMetric(req, res) {
	try {
		const newMetricData = JSON.parse(req.query.data);
		const query = await queries.updateMetric(
			req.user.gameId,
			newMetricData
		);
		if (!query || query.matchedCount < 1) return res.status(404).json(err);
		return res.status(200).json(query);
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function checkRewardData(req, res) {
	try {
		const data = JSON.parse(req.query.data);
		const metric = await getMetric(req.user.gameId, data.metricId);
		return res.status(200).json(getRewards(metric, data.scoreData));
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
}

async function giveRewards(req, res) {
	try {
		const data = JSON.parse(req.query.data);
		const metric = await getMetric(req.user.gameId, data.metricId);
		const rewardData = getRewards(metric, data.scoreData);
		console.log(rewardData);

		//TODO: assign cards based on rewardData
		rewardData.forEach(async (data) => {
			const playerInfo = await queries.getUserDataById(data._id);
			const player = new Player(playerInfo);

			console.log(player.game.inventory.cardInstances.length);
			data.rewards.forEach(async (reward) => {
				console.log(data._id, reward);
				for (let i = 0; i < reward.amount; i++) {
					const cardArray = cardUtils.convertDeckObjectToArray(
						deck.Cards
					);
					const cardList = cardUtils.filterCardArrayByRarity(
						cardArray,
						reward.rarity
					);
					let newCard =
						cardUtils.getRandomCardFromCardArray(cardList);
					let newCardInstance = {};
					player.game.stats.numberOfCardsDrawn += 1;
					// Card Type 0 is a Hub Card, 1 is an Action Card
					if (newCard.cardType == 0) {
						newCardInstance = {
							effectiveIncome: newCard.baseIncome,
							instanceId: player.game.stats.numberOfCardsDrawn,
							cardId: newCard.id,
							cardType: newCard.cardType,
							modifiers: {
								owner: {},
								hub: {},
								income: [],
							},
						};
					} else {
						newCardInstance = {
							instanceId: player.game.stats.numberOfCardsDrawn,
							cardId: newCard.id,
							cardType: newCard.cardType,
						};
					}
					player.game.inventory.cardInstances.push(newCardInstance);
					const logData = {
						userId: player.profile.id,
						...newCardInstance,
					};
					queries.updateActionLog(player.game.id, logData, 1);
				}
			});
			console.log(
				player.game.inventory.cardInstances.length,
				player.game.stats.numberOfCardsDrawn
			);
			queries.updateUserStatsAndInventory(player).catch(console.log);
		});

		return res.status(200).json(rewardData);
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
}

function getRewards(metric, scoreData) {
	rewardData = [...scoreData];
	rewardData.sort((a, b) => b.score - a.score);
	rewardData.forEach((x) => (x.rewards = undefined));
	let playerIndex = 0;
	let rewardIndex = 0;
	while (rewardIndex < metric.positionBasedRewards.length) {
		const thisScore = rewardData[playerIndex].score;
		const thisRewardIndex = rewardIndex;
		while (
			playerIndex < rewardData.length &&
			rewardData[playerIndex].score == thisScore
		) {
			rewardData[playerIndex].rewards =
				metric?.positionBasedRewards[thisRewardIndex].rewards;
			playerIndex++;
			rewardIndex++;
		}
	}
	metric.scoreBasedRewards.sort((a, b) => b.score - a.score);
	for (let i = playerIndex; i < rewardData.length; i++) {
		const thisPlayer = rewardData[i];
		for (let j = 0; j < metric.scoreBasedRewards.length; j++) {
			const thisReward = metric.scoreBasedRewards[j];
			if (thisPlayer.score < thisReward.score) continue;
			thisPlayer.rewards = thisReward.rewards;
			break;
		}
	}
	return rewardData;
}

async function getCardsBaseData(req, res) {
	try {
		const cardData = await (await queries.getCards()).toArray();
		if (cardData == undefined || cardData.length < 0)
			return res.status(400).json('Error Getting Card Data');
		return res.status(200).json(cardData);
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
}

async function updateCard(req, res) {
	try {
		const cardData = JSON.parse(req.query.data);
		console.log(cardData);
		if (cardData.id == undefined)
			return res.status(400).json('Error Getting Card Data');
		delete cardData._id;
		const update = await queries.updateCard(cardData);
		console.log(update);
		return res.status(200).json(cardData);
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
}

async function getAccountData(req, res) {
	try {
		const accountData = await (
			await queries.getAccounts(req.user.gameId)
		).toArray();
		if (accountData == undefined || accountData.length < 0)
			return res.status(400).json('Error Getting Account Data');
		return res.status(200).json(accountData);
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
}

async function updateAccount(req, res) {
	try {
		const accountData = JSON.parse(req.query.data);
		console.log(accountData);
		if (accountData._id == undefined)
			return res.status(400).json('Error Getting Card Data');
		const update = await queries.updateAccount(accountData);
		console.log(update);
		return res.status(200).json(accountData);
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
}

const admin = {
	authenticateAdmin,
	testResultData,
	adminMetrics,
	updateMetric,
	checkRewardData,
	giveRewards,
	getCardsBaseData,
	updateCard,
	getAccountData,
	updateAccount,
};

module.exports = admin;
