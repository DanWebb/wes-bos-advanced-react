require('dotenv').config({path:'variables.env'});
const createServer = require('./createServer');

const server = createServer();

server.start({
	cors: {
		credentials: true,
		origin: process.env.FRONTEND_URL
	}
}, details => {
	console.log(`server is now running on http://localhost:${details.port}`);
});
