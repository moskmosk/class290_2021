module.exports = {
    registerDataValidator (req, res, next) {
        const { username, firstName, lastName, password} = req.body;
        
        if (!username || !firstName || !lastName || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'fields must be required.'
            });
        } else if (username.length < 4) {
            return res.status(400).json({
                status: 'fail',
                message: 'username length must be 4 or above.'
            });
        }

        req.body.firstName = firstName.trim();
        req.body.lastName = lastName.trim();

        next();
    }
}