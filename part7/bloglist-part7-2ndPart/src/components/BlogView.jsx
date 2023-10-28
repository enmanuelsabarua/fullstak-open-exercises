import { useState } from 'react';
import './BlogView.css';

export const BlogView = ({ blog, likeBlog, user, removeBlog, addCommentMutation }) => {
    const [comment, setComment] = useState('')
    const addComment = async e => {
        e.preventDefault();
        setComment('')
        const content = e.target.content.value;
        addCommentMutation.mutate([blog.id, { content }])
    }


    return (
        <div>
            <h2>{blog.title}</h2>
            <div><a href={blog.url}>{blog.url}</a></div>
            <p>likes {blog.likes} <button id="like-button" className="likeButton" onClick={() => likeBlog(blog.id)}>like</button> </p>
            {user.id === (blog.user.id || blog.user) &&
                <button onClick={() => removeBlog(blog.id)}>remove</button>
            }
            <p>added by {blog.author}</p>

            <h2>comments</h2>
            <form onSubmit={addComment}>
                <input name='content' id='content' type="text" placeholder="Add comment" value={comment} onChange={({ target }) => setComment(target.value)} />
                <button type="submit">add</button>
            </form>
            <ul>
                {blog.comments.map(comment => <li key={comment.id}>{comment.content}</li>)}
            </ul>
        </div>
    )
}
