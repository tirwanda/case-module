const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ErrorHandler = require('./middleware/error');

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// config
if (process.env.NODE_ENV !== 'PRODUCTION') {
	require('dotenv').config({
		path: '.env',
	});
}

// Route imports
const user = require('./routes/web/userRoutes');
const employee = require('./routes/web/employeeRoutes');
const PICArea = require('./routes/web/PICAreaRoutes');
const incident = require('./routes/web/incidentRoutes');
const victim = require('./routes/web/victimRoutes');
const witness = require('./routes/web/witnessRoutes');
const perpetrator = require('./routes/web/perpetratorRoutes');
const callingLetter = require('./routes/web/callingLetterRoutes');
const statementLetter = require('./routes/web/statementLetterRoutes');
const bap = require('./routes/web/bapRoutes');

app.use('/api/v1', user);
app.use('/api/v1', employee);
app.use('/api/v1', PICArea);
app.use('/api/v1', incident);
app.use('/api/v1', victim);
app.use('/api/v1', witness);
app.use('/api/v1', perpetrator);
app.use('/api/v1', callingLetter);
app.use('/api/v1', statementLetter);
app.use('/api/v1', bap);

// it's for errorHandeling
app.use(ErrorHandler);

module.exports = app;
