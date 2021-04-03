const User = require('../users/user.entity');
const { Unauthorized, Locked } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersAttempt = {};

class AuthService {
    async validate(username, password) {

        const user = await User.findOne({ username });
        if (!user) {
            throw new Unauthorized();
        }

        if (!bcrypt.compareSync(password, user.password)) {
            if (usersAttempt[username]) {
                usersAttempt[username]++;
            } else {
                usersAttempt[username] = 1;
            }

            if (usersAttempt[username] > 2) {
                user.isLocked = true;
                await user.save();
            }

            if (user.isLocked) {
                throw new Locked('The user is locked!');
            }
            
            throw new Unauthorized('Password is incorrect');
        }

        return user;
    }

    async login(username, password) {
        const user = await this.validate(username, password);

        if (usersAttempt[username]) {
            delete usersAttempt[username];
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }
}

module.exports = new AuthService();