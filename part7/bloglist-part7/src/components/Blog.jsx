import { useState } from "react";

const Blog = ({ blog, likeBlog, user, removeBlog }) => {
  const [buttonLabel, setButtonLabel] = useState('view');
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleButtonLabel = () => {
    if (buttonLabel === 'view') {
      setButtonLabel('hide')
    } else {
      setButtonLabel('view')
    }
  }


  return (
    <div className="blog" style={blogStyle}>
      {blog.title}
      {` - ${blog.author}`}
      <button className="view-button" onClick={toggleButtonLabel}>{buttonLabel}</button>
      {buttonLabel === 'hide' &&
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button id="like-button" className="likeButton" onClick={() => likeBlog(blog.id)}>like</button> </p>
          {user.id === (blog.user.id || blog.user) &&
            <button onClick={() => removeBlog(blog.id)}>remove</button>
          }
        </div>
      }
    </div>
  )
}

export default Blog