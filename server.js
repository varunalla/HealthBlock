const express = require('express');
const path=require('path');
const logger = require('pino')();

const { init_web3 } = require('./web3-utils/user');
init_web3();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const MetaAuth = require('meta-auth');
const app = express();
const metaAuth = new MetaAuth();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(express.static('client/build'));
require('./authentication/auth-routes')(app, metaAuth);
app.get('*', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
app.listen(3001, () => {
    logger.info(`Server started at 3001`);
});