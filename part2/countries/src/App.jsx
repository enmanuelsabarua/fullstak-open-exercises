import { useEffect, useState } from 'react';
import axios from 'axios';
import Result from './components/Result';

function App() {
  const [results, setResults] = useState([]);
  const [country, setCountry] = useState('');
  const [countriesName, setCountriesName] = useState([]);
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const allCountries = [];
          response.data.forEach(country => {
            allCountries.push(country.name.common.toLowerCase());
          });
          setCountriesName(allCountries);
        });

  }, [])

  useEffect(() => {

    if (country) {
      const countryName = countriesName.filter(countryOnTheList => countryOnTheList.includes(country));

      if (countryName.length > 1 && countryName.length <= 10) {
        setResults(countryName);
      } else if(countryName.length > 10 ) {
        setResults('Too many matches, specify another filter')
      } else {
          queryCountry(countryName);
      }
    }
  }, [country]);

  const queryCountry = countryName => {
    console.log(countryName);
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
      .then(response => {
        const resultsOnTheFirstAPI = [response.data];
        console.log(import.meta.env);
        const api_key = import.meta.env.VITE_API_KEY;
        
        axios
        .get(`https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.latlng[0]}&lon=${response.data.latlng[1]}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeatherInfo(response.data.current);
          setResults(resultsOnTheFirstAPI);
          })
      })
      .catch(error => {
        console.log('country not found', error);
      });

  }

  const handleCountry = e => {
    setCountry(e.target.value.toLowerCase());
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="country">find countries</label>
        <input type="text" value={country} onChange={handleCountry}/>
      </form>
      <div>
        <Result results={results} queryCountry={queryCountry} weatherInfo={weatherInfo}/>
      </div>
    </>
  )
}

export default App
