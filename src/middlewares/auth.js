const jwt = require('jsonwebtoken');
const Key = "123456"

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token)
            return res.status(400).json({ msg: 'Invalid Authentication' });
        jwt.verify(token, Key, (err, user) => {
            if (err)
                return res.status(400).json({ msg: 'Invalid Authentication' });
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(500).json({ msg: 'error at auth' });
    }
};

module.exports = auth;
