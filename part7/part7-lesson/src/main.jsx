import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import App from './App.jsx'

const Home = () => (
  <div><h2>TKTL notes app</h2></div>
)

const Notes = () => (
  <div><h2>Notes</h2></div>
)

const Users = () => (
  <div><h2>Users</h2></div>
)

const App = () => {
  const padding = {
    padding: 5
  }

  return (
    <div className='container'>
      <Router>
        <div>
          <Link style={padding} to="/" >Home</Link>
          <Link style={padding} to="/notes" >notes</Link>
          <Link style={padding} to="/users" >users</Link>
        </div>

        <Routes>
          <Route path='/notes' element={<Notes />} />
          <Route path='/users' element={<Users />} />
          <Route path='/' element={<Home />} />
        </Routes>

        <div>
          <i>Note app, Department of Computer Science 2023</i>
        </div>
      </Router>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
