const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD
	}
});

const emailHtml = text => `
	<div class="email" style="
		border: 1px solid black;
		padding: 20px;
		font-family: sans-serif;
		line-height: 2;
		font-size: 20px;
	">
		<h2>Hellow</h2>
		<p>${text}</p>
		<p>🐣</p>
	</div>
`

exports.transport = transport;
exports.emailHtml = emailHtml;