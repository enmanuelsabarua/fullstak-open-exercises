const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    res.json(blogs);
});

blogRouter.post('/', middleware.userExtractor, async (req, res) => {
    console.log('creating');
    const body = req.body;

    const user = req.user;

    if (!(body.title && body.url)) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    const blog = new Blog({ ...req.body, user: user.id });

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    res.status(201).json(result);
});

blogRouter.put('/:id', middleware.userExtractor, async (req, res) => {
    const { title, author, url, likes } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query' })
    res.json(updatedBlog);
})

blogRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
    const user = req.user;
    
    const blog = await Blog.findById(req.params.id);
    
    console.log(blog);
    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndDelete(req.params.id)
    }
    res.status(204).end();
})

module.exports = blogRouter;