const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'variables.env'});
const createServer = require('./createServer');

const server = createServer();

server.express.use(cookieParser());

server.express.use((req, res, next) => {
	const token = req.cookies.token;
	if (token) {
		const {userId} = jwt.verify(token, process.env.APP_SECRET);
		req.userId = userId;
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
