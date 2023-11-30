const jwt = require('jsonwebtoken')
const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['authorization']
    if (!token) {
        res.status(404).json({ message: "Auth Token is required for authentication" })
    } else {
        try {
            const decode = jwt.verify(token, process.env.JWT_SECREAT)
            req.user = decode

        } catch (error) {
            res.status(400).json({ message: "Invalid token" })
        }
    }
    return next();
}

module.exports = verifyToken;