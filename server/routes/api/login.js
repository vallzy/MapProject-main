const express = require('express');
const configs = require('../../configs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dbh = require('../../data/dbhandler');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && username !== "" && password && password !== "") {
        const userResult = await dbh.getUsername([username]);
        if (userResult && userResult.length === 1) {
            const authenticated = bcrypt.compareSync(password, userResult[0].password);
            if (authenticated) {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 7),
                    role: userResult[0].role
                }, configs.secret);

                res.json({ token });
                res.status(200);
                return;
            } else {
                res.status(403).send('Invalid username or password.');
                return;
            }
        }
    }
    res.status(403).send('Invalid username or password.');
});

module.exports = router;