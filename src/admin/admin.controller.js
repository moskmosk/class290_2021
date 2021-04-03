const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const users = require('../users/users.service');

router.patch('/lock-user/:id', asyncHandler(async (req,res) => {
    const id = req.params.id;
    const user = await users.update(id, {isLocked: true});
    res.json({"message": "User has successfully been locked!"});
}));


router.patch('/unlock-user/:id', asyncHandler(async (req,res) => {
    const id = req.params.id;
    const user = await users.update(id, {isLocked: false});
    res.json({"message": "User has successfully been unlocked!"});
}));

module.exports = router;