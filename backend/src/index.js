const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'variables.env'});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

server.express.use(async (req, res, next) => {
	const token = req.cookies.token;
	if (token) {
		const {userId} = jwt.verify(token, process.env.APP_SECRET);
		const user = await db.query.user({where: {id: userId}}, '{id, permissions, email, name}');
		req.userId = userId;
		req.user = user;
	}
	next();
})

server.start({
	cors: {
		credentials: true,
		origin: process.env.FRONTEND_URL
	}
}, details => {
	console.log(`server is now running on http://localhost:${details.port}`);
});
