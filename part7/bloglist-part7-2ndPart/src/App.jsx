import { useState, useEffect, useReducer } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Routes, Route, Link, useMatch, Navigate, useNavigate } from 'react-router-dom';
import blogService from './services/blogs';
import loginService from './services/login';
import usersService from './services/user';
import commentService from './services/comments';
import notificationReducer from './reducers/notificationReducer';
import userReducer from './reducers/userReducer';
import { Home } from './components/Home';
import { Users } from './components/Users';
import { User } from './components/User';
import { BlogView } from './components/BlogView';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const [notification, notificationDispatch] = useReducer(notificationReducer, { type: null, message: null })
  const [user, userDispatch] = useReducer(userReducer, '')
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })
  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const addCommentMutation = useMutation({
    mutationFn: commentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: 'SET_USER', payload: user });
      blogService.setToken(user.token);
    }
  }, []);


  useEffect(() => {
    usersService.getAllUsers().then(users => setUsers(users));
  }, [])

  const matchUser = useMatch('/users/:id');
  const userInfo = matchUser
    ? users.find(user => user.id.toString() === matchUser.params.id.toString())
    : null;

  const matchBlog = useMatch('/blogs/:id');


  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll()
  })

  if (result.isLoading) {
    return <div>Loading...</div>
  }


  const blogs = result.data;

  const blogInfo = matchBlog
    ? blogs.find(blog => blog.id.toString() === matchBlog.params.id.toString())
    : null;

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username, password
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      userDispatch({ type: 'SET_USER', payload: user });
      setUsername('');
      setPassword('');

    } catch (error) {
      notificationDispatch({ type: 'SET_TYPE', payload: 'error' });
      notificationDispatch({ type: 'SET_MESSAGE', payload: 'wrong username or password' });
      setTimeout(() => {
        notificationDispatch({ type: 'SET_MESSAGE', payload: null })
      }, 5000);
    }

  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    userDispatch({ type: 'SET_USER', payload: '' });
    navigate('/');
  }


  const handleAddBlog = async e => {
    e.preventDefault();

    toggleVisibility();

    const blogObject = {
      title,
      author,
      url
    }

    newBlogMutation.mutate(blogObject);
    setTitle('');
    setAuthor('');
    setUrl('');
    notificationDispatch({ type: 'SET_TYPE', payload: 'success' });
    notificationDispatch({ type: 'SET_MESSAGE', payload: `A new blog ${blogObject.title} by ${blogObject.author} added` })
    setTimeout(() => {
      notificationDispatch({ type: 'SET_MESSAGE', payload: null })
    }, 5000);
  }

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  const likeBlog = async id => {
    const blog = blogs.find(b => b.id === id);
    const changeBlog = { ...blog, likes: blog.likes + 1 }

    try {
      updateBlogMutation.mutate(changeBlog);
    } catch (error) {
      console.log(error);
      notificationDispatch({ type: 'SET_TYPE', payload: 'error' });
      notificationDispatch({ type: 'SET_MESSAGE', payload: 'unable to like blog' });

      setTimeout(() => {
        notificationDispatch({ type: 'SET_MESSAGE', payload: null })
      }, 5000);

    }
  }

  const removeBlog = async id => {
    const blogToDelete = blogs.find(blog => blog.id === id);


    if (window.confirm('Do you want to delete this blog?') === true) {
      try {
        deleteBlogMutation.mutate(blogToDelete.id)
      } catch (error) {
        notificationDispatch({ type: 'SET_TYPE', payload: 'error' });
        notificationDispatch({ type: 'SET_MESSAGE', payload: 'unable to remove blog' });

        setTimeout(() => {
          notificationDispatch({ type: 'SET_MESSAGE', payload: null })
        }, 5000);
      }
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <>
      {user &&
        <div>
          <nav className='navBar'>
            <Link style={padding} to="/" >Blogs</Link>
            <Link style={padding} to="/users" >Users</Link>
            {user
              && <div className='user-info'>
                <em>{user.name} logged in</em>
                <button onClick={handleLogOut}>Log out</button>
              </div>
            }
          </nav>
        </div>}

      <Routes>
        <Route path='/users/:id' element={<User user={userInfo} />} />
        <Route path='/blogs/:id' element={<BlogView addCommentMutation={addCommentMutation} blog={blogInfo} likeBlog={likeBlog} user={user} removeBlog={removeBlog} />} />
        <Route path='/users' element={user ? <Users users={users} /> : <Navigate replace to='/' />} />
        <Route path='/' element={<Home notification={notification} blogs={blogs} user={user} handleAddBlog={handleAddBlog} handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword} visible={visible} toggleVisibility={toggleVisibility} setTitle={setTitle} setAuthor={setAuthor} setUrl={setUrl} likeBlog={likeBlog} removeBlog={removeBlog} />} />
      </Routes>
    </>
  )
}

export default App