const Person = ({ id, name, number, deletePerson}) => {
    return (
        <div>
            <p>
                {name} {number} <button onClick={() => deletePerson(id)}>delete</button>
            </p>
        </div>
    )
}

export default Person;