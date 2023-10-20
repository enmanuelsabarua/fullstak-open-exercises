const Filter = ({ handleSearch, searchValue}) => {

    return (
        <div>
          filter shown with <input onChange={handleSearch} value={searchValue}/>
        </div>
    );
}

export default Filter;