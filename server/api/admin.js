const queries = require('./../queries/queries');

// middleware to authenticate if user is an admin
async function authenticateAdmin(req, res, next) {
	try {
		console.log(req.user);
		const userData = await queries.getUserDataBasicById(req.user.id);
		if (!userData) return res.status(404).json('Player Not Found');
		console.log(userData);
		if (!userData.profile.isAdmin)
			return res.status(400).json('Player Not Admin');
		next();
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
}

const admin = {
	authenticateAdmin,
};

module.exports = admin;
