const mongoose = require('mongoose');
const helper = require('./test_helper');
const superset = require('supertest');
const app = require('../app');
const api = superset(app);
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');

let token;
let userId;
describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash})
        userId = user._id;
        
        await user.save();
        const res = await api.post('/api/login')
            .send({ username: 'root', password: 'sekret'});

        token = res._body.token;
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails with proper statuscode and message if username or password are not valid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'test',
            name: 'Tester',
            password: '123',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('invalid username or password')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)

    })
});
describe('when the db is empty', () => {
    
    beforeEach(async () => {
        await Blog.deleteMany({});

        let blogObject = helper.initialBlogs.map(blog => new Blog({...blog, user: userId}));
        const promiseArray = blogObject.map(blog => blog.save());
        await Promise.all(promiseArray);
    });

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-type', /application\/json/);
    });

    test('all blogs posts are returned', async () => {
        const blogsAtStart = await helper.blogsInDb();

        expect(blogsAtStart).toHaveLength(helper.initialBlogs.length);
    })

    test('blogs have the id property', async () => {
        const blogsAtStart = await helper.blogsInDb();

        expect(blogsAtStart[0].id).toBeDefined()
    });

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-type', /application\/json/);

        const blogAtEnd = await helper.blogsInDb();
        expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1);

        const contents = blogAtEnd.map(r => r.title);

        expect(contents).toContain(
            "First class tests"
        );
    })

    test('a default like value is added', async () => {
        const newBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-type', /application\/json/);
            
            const blogAtEnd = await helper.blogsInDb();
            const addedBlog = blogAtEnd.find(blog => blog.title === "Type wars");
            expect(addedBlog.likes).toEqual(0);
            
        });
        
        test('blog without content is not added', async () => {
            const newBlog = {
                author: "Robert C. Martin",
                likes: 12
            }
            
            await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400);
            
        const blogAtEnd = await helper.blogsInDb();
        expect(blogAtEnd).toHaveLength(helper.initialBlogs.length);
        
    });
    
    test('update a blog', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = {
            ...blogsAtStart[0],
            likes: 20
        };
        
        await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogToUpdate);
        
        const blogsAtEnd = await helper.blogsInDb();
        const updatedBlog = blogsAtEnd[0];
        
        expect(updatedBlog.likes).toEqual(20);
        
    })
    
    test('deletion of a blog', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];
        
        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
        
        const blogsAtEnd = await helper.blogsInDb();

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

        const contents = await blogsAtEnd.map(r => r.title);

        expect(contents).not.toContain(blogToDelete.title)
    });
})


afterAll(async () => {
    await mongoose.connection.close();
})