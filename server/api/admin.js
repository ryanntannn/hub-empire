const queries = require('./../queries/queries');

// middleware to authenticate if user is an admin
async function authenticateAdmin(req, res, next) {
	try {
		console.log(req.user);
		const userData = await queries.getUserDataBasicById(req.user.id);
		if (!userData) return res.status(404).json('Player Not Found');
		console.log(userData);
		req.user.gameId = userData.game.id;
		if (!userData.profile.isAdmin)
			return res.status(400).json('Player Not Admin');
		next();
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
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

const admin = {
	authenticateAdmin,
	adminMetrics,
};

module.exports = admin;
