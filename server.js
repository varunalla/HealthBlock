const express = require('express');
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
require("./appointments/appointment-routes")(app)
app.listen(3001, () => {
    console.log('server started at ', 3001);
});