const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {CUSTOMER_ROLE, ADMIN_ROLE} = require('../commons/util');

const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: [ ADMIN_ROLE,CUSTOMER_ROLE ],
        default: CUSTOMER_ROLE,
        required: true
    },

    isLocked: {
        type: Boolean,
        default: false,
    }
}, { collection: 'users' });

schema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync();
        this.password = bcrypt.hashSync(this.password, salt);
    }

    next();
})

module.exports = mongoose.model('User', schema);