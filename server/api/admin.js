const queries = require('./../queries/queries');
const jwt = require('jsonwebtoken');

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

const admin = {
	authenticateAdmin,
	adminMetrics,
};

module.exports = admin;
