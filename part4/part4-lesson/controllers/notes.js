const noteRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

noteRouter.get('/', async (req, res) => {
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
    res.json(notes);
});

noteRouter.get('/:id', async (req, res) => {
    const note = await Note.findById(req.params.id)
    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

noteRouter.put('/:id', async (req, res) => {
    const { content, important } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
    res.json(updatedNote);
})

noteRouter.delete('/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    res.status(204).end();
});

const getTokenFrom = req => {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }

    return null;
}

noteRouter.post('/', async (req, res) => {
    const body = req.body;
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);

    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        user: user.id
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
});

module.exports = noteRouter;