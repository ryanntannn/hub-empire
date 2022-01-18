const { generateAccessToken } = require('../utils/authentication');
const bcrypt = require('bcrypt');

//will be moved to a db
const users = [
	{
		name: 'dev',
		password:
			'$2b$10$h9RlHIGbZix6fV7OiBckN./mNoNeQESYZxJoS965XtYSHn3MdcFMq',
	},
];

async function login(req, res) {
	//Authenticate first
	const user = users.find((user) => user.name == req.body.name);
	if (user == null) return res.status(400).send('User not found');
	try {
		if (!(await bcrypt.compare(req.body.password, user.password))) {
			return res.status(400).send('Password is incorrect');
		}
		const accessToken = generateAccessToken({ name: user.name });
		return res.json({
			userData: { name: user.name },
			accessToken: accessToken,
		});
	} catch {
		return res.status(500);
	}
}

async function register(req, res) {
	console.log(users);
	if (users.some((user) => user.name == req.body.name))
		return res.sendStatus(403);
	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const user = {
			name: req.body.name,
			password: hashedPassword,
		};
		users.push(user);
		const accessToken = generateAccessToken({ name: user.name });
		return res.json({ accessToken: accessToken });
	} catch {
		return res.status(500);
	}
}

module.exports = { login, register, users };
