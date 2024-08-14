const jwt = require("jsonwebtoken");
const db = require('../database/models')

async function authenticateToken (req, res, next){
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ error: 'No token provided.' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

async function checkAdmin (req, res, next){
    try {
        const admin = await db.Admin.findOne({
            where: {
                userId: req.user.userId
            }
        });

        if (!admin) {
            return res.status(403).json({ error: 'No admin privileges.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {authenticateToken, checkAdmin}