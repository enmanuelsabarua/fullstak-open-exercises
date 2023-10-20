const CountryInfo = ({ name, capital, area, languages, flagImg, temperature, weatherImg, wind}) => {
    const languagesArray = [];
    for (const key in languages) {
        languagesArray.push(languages[key]);
    }
    
    
    return (
        <div>
            <h1>{name}</h1>
            <p>capital {capital}</p>
            <p>area {area}</p>

            <h2>languages:</h2>
            <ul>
                {languagesArray.map(language => <li key={language}>{language}</li>)}
            </ul>

            <img src={flagImg} alt="Flag" />

            <h1>Weather in {capital}</h1>
            <p>temperature {temperature} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${weatherImg}@2x.png`} alt="Weather" />
            <p>wind {wind} m/s</p>
        </div>
    )
}

export default CountryInfo;