import { useState, useEffect, useRef } from "react"
import Note from "./components/Note"
import noteService from './services/notes';
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";
import Footer from "./components/Footer";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes);
      })
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
      })

  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const changeNote = { ...note, important: !note.important }

    noteService
      .update(id, changeNote)
      .then(initialNotes => {
        setNotes(notes.map(n => n.id !== id ? n : initialNotes));
      })
      .catch(error => {
        console.log(error);
        setErrorMessage(`the note '${note.content}' was already deleted from server`);

        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);

        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const handleLogin = async (e, username, password, setUsername, setPassword) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));

      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  }

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel='login'>
          <LoginForm
            handleSubmit={handleLogin}
          />

        </ Togglable>
      </div>
    )
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser('');
  }

  const noteFormRef = useRef();

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm
        createNote={addNote}
      />
    </ Togglable>
  );

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user &&
        <div>
          <button onClick={logOut}>log out</button>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />)}
      </ul>

      <Footer />
    </div>
  )
}

export default App