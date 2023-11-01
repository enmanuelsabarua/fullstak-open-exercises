const { GraphQLError } = require('graphql');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (!args.author && !args.genre) {
                return Book.find({}).populate('author');
            } else if (!args.genre) {
                const books = await Book.find({}).populate('author');
                const authorBooks = books.filter(b => b.author.name === args.author);
                return authorBooks;
            } else if (!args.author) {
                const books = await Book.find({}).populate('author');
                const genreBooks = books.filter(b => b.genres.includes(args.genre));
                return genreBooks;
            }

            const books = await Book.find({}).populate('author');
            const genreBooks = books.filter(b => b.genres.includes(args.genre));
            const authorBooks = genreBooks.filter(b => b.author.name === args.author);
            return authorBooks;

        },
        allAuthors: async () => Author.find({}),
        me: (root, args, context) => context.currentUser
    },
    Author: {
        bookCount: async root => {
            const books = await Book.find({}).populate('author');
            const countBook = books.filter(b => b.author.name === root.name);
            return countBook.length;
        }
    },
    Book: {
        author: root => {
            return {
                id: root.author._id,
                name: root.author.name,
                born: root.author.born,
            }
        }
    },
    Mutation: {
        addBook: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                });
            }

            let author;
            if ((await Author.find({ name: args.author })).length === 0) {
                const newAuthor = {
                    name: args.author,
                    born: null,
                    bookCount: 1
                }

                author = new Author(newAuthor);
                try {
                    await author.save();
                } catch (error) {
                    throw new GraphQLError('Saving author failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error
                        }
                    });
                }
            }

            const book = new Book({ ...args, author: author._id });

            try {
                await book.save();
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: { ...args },
                        error
                    }
                });
            }
            
            pubsub.publish('BOOK_ADDED', { bookAdded: book });
            return Book.findOne({ title: args.title }).populate('author', { name: 1, born: 1 });
        },
        editAuthor: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                });
            }

            const author = await Author.findOne({ name: args.name });
            author.born = args.setBornTo;

            try {
                return author.save();
            } catch (error) {
                throw new GraphQLError('Saving author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.setBornTo,
                        error
                    }
                });
            }

        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    });
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                });
            }

            const userForToken = {
                username: args.username,
                id: user._id
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }

        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    }
}

module.exports = resolvers;