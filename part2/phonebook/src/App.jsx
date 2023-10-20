import { useState, useEffect } from 'react'
import personsService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [filteredResults, setFilteredResults] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
  }, [])

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  }

  const handlePhoneChange = e => {
    setNewNumber(e.target.value);
  }

  const handleSearch = e => {
    setFilteredResults([])
    persons.map(person => {
      if ((person.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))) {

        let onTheResult = false;
        filteredResults.forEach(result => {
          if (result.name === person.name) {
            onTheResult = true;
          }
        })

        if (!onTheResult) setFilteredResults(filteredResults.concat(person));
      }
    })
    if (e.target.value === '') setFilteredResults([])
    setSearchValue(e.target.value);
  }

  const addName = (e) => {
    e.preventDefault();
    const newPersonObject = {
      name: newName,
      number: newNumber
    }

    let add = true;
    persons.forEach(person => {
      if (person.name === newPersonObject.name) {
        if (window.confirm(`${person.name} is already added to the phonebook, replace the old number with a new one?`)) {
          updateNumber(person.id);
          setNewName('');
          setNewNumber('');
          setNotificationType('success');
          setNotificationMessage(`Updated ${newPersonObject.name}`);
        } 
        
        add = false;
      }
    })

    if (add) {
      personsService
        .create(newPersonObject)
        .then(initialPersons => {
          setPersons(persons.concat(initialPersons))
          setNewName('');
          setNewNumber('');
          setNotificationType('success');
          setNotificationMessage(`Added ${newPersonObject.name}`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        })
        .catch(error => {
          setNotificationType('error');
          setNotificationMessage(`${error.response.data.error}`);
        });
    }
  }

  const deletePerson = id => {
    const person = persons.find(p => p.id === id);

    if (window.confirm(`Delete ${person.name} ?`)) {
      personsService
        .remove(id)
        .then(response => {
          console.log(response);
          setPersons(persons.filter(p => p.id !== id ))
        })
        .catch(error => {
          console.log('error', error);
          setNotificationType('error');
          setNotificationMessage(`Information of ${person.name} has already remove from server`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
          
        })
    }
  }

  const updateNumber = id => {
    const person = persons.find(p => p.id === id);
    const changeNumber = {...person, number: newNumber}

    personsService
      .update(id, changeNumber)
      .then(initialPersons => {
        setPersons(persons.map(p => p.id !== id ? p : initialPersons));
      })
      .catch(error => {
        console.log(error);
        alert(`the note '${person.content}' was already deleted from server`);
        setPersons(person.filter(p => p.id !== id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <Filter handleSearch={handleSearch} searchValue={searchValue} />
      <h3>Add a new</h3>
      <PersonForm addName={addName} handleNameChange={handleNameChange} newName={newName} handlePhoneChange={handlePhoneChange} newNumber={newNumber} />
      <h2>Numbers</h2>
      <Persons deletePerson={deletePerson} filteredResults={filteredResults} persons={persons} />
    </div>
  )
}

export default App