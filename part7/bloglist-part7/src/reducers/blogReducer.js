import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blogs';

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        appendBlog(state, action) {
            state.push(action.payload)
        },
        setBlogs(state, action) {
            return action.payload;
        }
    }
});

export const { appendBlog, setBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    }
}

export const addLike = (id, blogs) => {
    return async dispatch => {
        const blogToChange = blogs.find(b => b.id === id);
        const changeBlog = { ...blogToChange, likes: blogToChange.likes + 1 }
        const updatedBlog = await blogService.update(id, changeBlog);
        dispatch(setBlogs(blogs.map(b => b.id !== id ? b : updatedBlog)));
    }
}

export const removeBlogAction = (id, blogs) => {
    return async dispatch => {
        const blogToDelete = blogs.find(blog => blog.id === id);
        await blogService.remove(blogToDelete.id);
        dispatch(setBlogs(blogs.filter(b => b.id !== id)));
    }
}

export default blogSlice.reducer;