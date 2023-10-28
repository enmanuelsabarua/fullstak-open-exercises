import Blog from "./Blog"
import BlogForm from "./BlogForm"
import LoginForm from "./LoginForm"
import Notification from "./Notification"
import Toggable from "./Togglable"
import './Home.css';

export const Home = ({ blogs, notification, user, handleAddBlog, handleLogin, setUsername, setPassword, visible, toggleVisibility, setTitle, setAuthor, setUrl, likeBlog, removeBlog }) => {
    const sortedBlogs = [...blogs].sort(function (a, b) {
        return b.likes - a.likes;
    });

    return (
        <div className="home">
            <Notification notification={notification} />
            {!user &&
                <div className="login-flex">
                    <h2>Log in to the application</h2>
                    <LoginForm handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />
                </div>
            }
            {user && <h1 className='title'>Blogs</h1>}
            {user &&
                <div>
                    <Toggable visible={visible} toggleVisibility={toggleVisibility} buttonLabel='New blog' title='Create new'>
                        <BlogForm handleAddBlog={handleAddBlog} setTitle={setTitle} setAuthor={setAuthor} setUrl={setUrl} />
                    </Toggable>
                    <div className='blogs'>
                        {sortedBlogs.map(blog => <Blog key={blog.id} likeBlog={likeBlog} blog={blog} user={user} removeBlog={removeBlog} />)}
                    </div>
                </div>
            }
        </div>
    )
}
