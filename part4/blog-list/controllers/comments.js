const commentRouter = require('express').Router();
const Comment = require('../models/comment');
const Blog = require('../models/blog');

commentRouter.get('/comments', async (req, res) => {
    const comment = await Comment.find({}).populate('blog');
    res.json(comment);
});

commentRouter.post('/:id/comments', async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const comment = new Comment({ content, blog: req.params.id});

    const result = await comment.save();
    const blogToUpdate = await Blog.findById(req.params.id);
    blogToUpdate.comments = blogToUpdate.comments.concat(result._id);
    await blogToUpdate.save();
    res.status(201).json(result);

})

module.exports = commentRouter;