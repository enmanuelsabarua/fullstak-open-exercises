const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res, next) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
    res.json(users);
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;

    if (!(username && password) || password.length <= 3 || username.length <= 3) {
        return res.status(400).json({error: 'invalid username or password'})
    }

    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();


    res.status(201).json(savedUser);
})

module.exports = usersRouter;