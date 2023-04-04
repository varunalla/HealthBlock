let jwt = require('jsonwebtoken');

const jwt_config = {
    secret: "TEST",
    expiry_time: 1800
}

const validate_jwt = (token, callback) => {
    jwt.verify(token, jwt_config.secret, function (err, decoded) {
        if (!err && decoded.client_address) {
            callback(null, decoded);
        }
        else {
            console.log(err);
            callback("error", null);
        }
    });
}

const encode_jwt = function (obj) {
    const jwtToken = jwt.sign(obj,
        jwt_config.secret,
        { expiresIn: parseInt(jwt_config.expiry_time) }
    );
    //obj.token = jwtToken;
    return jwtToken;
}

const verify_token = (req, res, next) => {
    let token = req.headers.token || req.query.token;

    if (token) {
        validate_jwt(token, (err, decoded) => {
            if (!err) {
                res.locals.decoded = decoded;
                next();
            }
            else
                res.status(403).send(err);
        });
    }
    else
        res.status(403).send("error");
}
module.exports = {
    encode_jwt,
    validate_jwt,
    verify_token
}