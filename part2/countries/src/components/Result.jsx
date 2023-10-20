import CountryInfo from "./CountryInfo";

const Result = ({ results, queryCountry, weatherInfo }) => {
    return (
        <div>
            {results.length === 1 ?
                <CountryInfo name={results[0].name.common} capital={results[0].capital} area={results[0].area} languages={results[0].languages} flagImg={results[0].flags.png} temperature={weatherInfo.temp} weatherImg={weatherInfo.weather[0].icon} wind={weatherInfo.wind_speed}/>  :
                typeof results !== 'string' ? results.map(result => {
                    return (
                        <div key={result}>
                            {result}
                            <button onClick={() => queryCountry(result)}>show</button>
                        </div>
                    )
                }) :
                results
            }
        </div>
    );
}

export default Result;