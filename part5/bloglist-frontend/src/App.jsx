import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Toggable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState('success');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
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
      setUser(user);
      setUsername('');
      setPassword('');

    } catch (error) {
      setNotificationType('error');
      setNotificationMessage('wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }

  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser('');
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
    setBlogs(blogs.concat(savedBlog));
    setTitle('');
    setAuthor('');
    setUrl('');
    setNotificationType('success');
    setNotificationMessage(`A new blog ${blogObject.title} by ${blogObject.author} added`);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  }

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  const likeBlog = async id => {
    const blog = blogs.find(b => b.id === id);
    const changeBlog = { ...blog, likes: blog.likes + 1 }

    try {
      const updatedBlog = await blogService.update(id, changeBlog)
      setBlogs(blogs.map(b => b.id !== id ? b : updatedBlog));
    } catch (error) {
      console.log(error);
      setNotificationType('error');
      setNotificationMessage('unable to like blog');

      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);

      setBlogs(blogs.filter(b => b.id !== id))
    }
  }

  const removeBlog = async id => {
    const blogToDelete = blogs.find(blog => blog.id === id);


    if (window.confirm('Do you want to delete this blog?') === true) {
      try {
        await blogService.remove(blogToDelete.id);
        setBlogs(blogs.filter(b => b.id !== id));
      } catch (error) {
        setNotificationType('error');
        setNotificationMessage('unable to remove blog');

        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      }
    }


  }


  const sortedBlogs = [...blogs].sort(function (a, b) {
    return b.likes - a.likes;
  });

  return (
    <div>
      <Notification message={notificationMessage} type={notificationType} />
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
            <BlogForm handleAddBlog={handleAddBlog} setTitle={setTitle} setAuthor={setAuthor} setUrl={setUrl} />
          </Toggable>
          <div className='blogs'>
            {sortedBlogs.map(blog => <Blog key={blog.id} likeBlog={likeBlog} blog={blog} user={user} blogUser={blog.user.username} removeBlog={removeBlog} />)}
          </div>
        </div>
      }
    </div>
  )
}

export default App