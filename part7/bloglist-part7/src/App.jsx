import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Blog from './components/Blog'
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Toggable from './components/Togglable';
import { setNotificationMessage } from './reducers/notificationReducer';
import { addLike, removeBlogAction, setBlogs } from './reducers/blogReducer';
import { setUser } from './reducers/userReducer';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs);
  const user = useSelector(state => state.user);
  const notificationMessage = useSelector(state => state.notifications);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      dispatch(setBlogs(blogs))
    )
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username, password
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername('');
      setPassword('');

    } catch (error) {
      dispatch(setNotificationMessage({ type: 'error', message: 'wrong username or password' }));

      setTimeout(() => {
        dispatch(setNotificationMessage({ type: null, message: null }));
      }, 5000);
    }

  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(setUser(''));
  }


  const handleAddBlog = async e => {
    e.preventDefault();

    toggleVisibility();

    const blogObject = {
      title,
      author,
      url
    }

    const savedBlog = await blogService.create(blogObject);
    dispatch(setBlogs(blogs.concat(savedBlog)));
    setTitle('');
    setAuthor('');
    setUrl('');
    dispatch(setNotificationMessage({ type: 'success', message: `A new blog ${blogObject.title} by ${blogObject.author} added` }));
    setTimeout(() => {
      dispatch(setNotificationMessage({ type: null, message: null }));
    }, 5000);
  }

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  const likeBlog = async id => {
    try {
      dispatch(addLike(id, blogs));

    } catch (error) {
      dispatch(setNotificationMessage({ type: 'error', message: 'unable to like blog' }));
      setTimeout(() => {
        dispatch(setNotificationMessage({ type: null, message: null }));
      }, 5000);

      dispatch(setBlogs(blogs.filter(b => b.id !== id)))
    }
  }

  const removeBlog = async id => {
    if (window.confirm('Do you want to delete this blog?') === true) {
      try {
        dispatch(removeBlogAction(id, blogs));
      } catch (error) {
        dispatch(setNotificationMessage({ type: 'error', message: 'unable to remove blog' }));
        setTimeout(() => {
          dispatch(setNotificationMessage({ type: null, message: null }));
        }, 5000);
      }
    }


  }


  const sortedBlogs = [...blogs].sort(function (a, b) {
    return b.likes - a.likes;
  });

  return (
    <div>
      <Notification notification={notificationMessage} />
      {!user &&
        <div>
          <h2>Log in to the application</h2>
          <LoginForm handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} />
        </div>
      }
      {user &&
        <div>
          <h2>blogs</h2>
          {user.name} logged in
          <button onClick={handleLogOut}>log out</button>
          <Toggable visible={visible} toggleVisibility={toggleVisibility} buttonLabel='new blog' title='create new'>
            <BlogForm handleAddBlog={handleAddBlog} setTitle={setTitle} setAuthor={setAuthor} setUrl={setUrl} title={title} author={author} url={url} />
          </Toggable>
          <div className='blogs'>
            {sortedBlogs.map(blog => <Blog key={blog.id} likeBlog={likeBlog} blog={blog} user={user} removeBlog={removeBlog} />)}
          </div>
        </div>
      }
    </div>
  )
}

export default App