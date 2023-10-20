import Person from "./Person";

const Persons = ({ filteredResults, persons, deletePerson}) => {
    return (
        <div>
            {filteredResults.length ?
                filteredResults.map((person) => <Person key={person.id} id={person.id} name={person.name} number={person.number} deletePerson={deletePerson} />) : 
                persons.map((person) => <Person key={person.id} id={person.id} name={person.name} number={person.number} deletePerson={deletePerson} />)}
        </div>
    );
}

export default Persons;