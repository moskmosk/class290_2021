const { Forbidden } = require('http-errors');
const { validateToken } = require('../../auth/auth.service');
const users = require('../../users/users.service');
const {CUSTOMER_ROLE, ADMIN_ROLE} = require('../util');

const jwtMiddleware = async (req, res, next) => {
    let token;
    try {
        token = req.header('Authorization').split(' ')[1];
        const user = validateToken(token);
        const dbUser = await users.findOne(user.userId);
        console.log(dbUser);
        user.role = dbUser.role;
        req.user = user;
    } catch (err) {
        console.log(err);
        return next(new Forbidden());
    }

    next();
}

const adminValidator = async (req, res, next) => {
    if (req.user.role !== ADMIN_ROLE) {
        return next(new Forbidden('Not authorized!'));
    }
    next();
}

jwtMiddleware.unless = require('express-unless');

module.exports = {
    jwtMiddleware,
    adminValidator
}