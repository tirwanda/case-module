const app = require('./app');
const connectDatabase = require('./db/db');
const functions = require('firebase-functions');

// Handling uncaught Exception
process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.message}`);
	console.log(`Shutting down the server for Handling uncaught Exception`);
});

// config
if (process.env.NODE_ENV !== 'PRODUCTION') {
	require('dotenv').config({
		path: '.env',
	});
}

// connect database
connectDatabase();

// create server
const server = app.listen(process.env.PORT, () => {
	console.log(
		`Server is working on ${process.env.BASE_URL}${process.env.PORT}`
	);
});

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
	console.log(`Shutting down server for ${err.message}`);
	console.log(`Shutting down the server due to Unhandled promise rejection`);
	server.close(() => {
		process.exit(1);
	});
});

exports.server = functions.https.onRequest(app);
