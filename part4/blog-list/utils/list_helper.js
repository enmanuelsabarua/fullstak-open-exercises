const _ = require('lodash');

const dummy = blogs => {
    return 1;
}

const totalLikes = blogs => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0);
}

const favoriteBlog = blogs => {
    const maxLikedNumber = Math.max(...blogs.map(blog => blog.likes));
    mostLikedBlog = blogs.find(blog => blog.likes === maxLikedNumber);

    const formattedBlog = {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes
    }

    return formattedBlog;
}

const mostBlogs = blogs => {
    const authorList = blogs.map(blog => blog.author);
    const result = _.head(_(authorList)
        .countBy()
        .entries()
        .maxBy(_.last));

    const blogAmount = blogs.filter(blog => blog.author === result).length;

    return {
        author: result,
        blogs: blogAmount
    };
}

const mostLikes = blogs => {
    const authorsLikes = {};

    blogs.forEach(blog => {
        if (authorsLikes[blog.author]) {
            authorsLikes[blog.author] += blog.likes;
        } else {
            authorsLikes[blog.author] = blog.likes;
        }
    });

    const mostLikedAuthor = Object.keys(authorsLikes).reduce((a, b) => authorsLikes[a] > authorsLikes[b] ? a : b);

    return {
        author: mostLikedAuthor,
        likes: authorsLikes[mostLikedAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}