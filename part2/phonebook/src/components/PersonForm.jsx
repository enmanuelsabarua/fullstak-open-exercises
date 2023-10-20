const PersonForm = ({ addName, handleNameChange, newName, handlePhoneChange, newNumber}) => {
    return (
        <form onSubmit={addName}>
        <div>
          name: <input onChange={handleNameChange} value={newName}/>
        </div>
        <div>
          number: <input onChange={handlePhoneChange} value={newNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm;