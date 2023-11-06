import { useEffect, useState } from "react";
import { Diary } from "./types";
import { getAllDiaries, createDiary } from "./services/diaryService";
import axios from "axios";

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = (e: React.SyntheticEvent) => {
    e.preventDefault();
    createDiary({ date, visibility, weather, comment })
      .then((data) => {
        setDiaries([...diaries, data]);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data);
          setTimeout(() => {
            setError("");
          }, 5000);
        } else {
          console.log(error.data);
        }
      });

    setDate("");
    setVisibility("");
    setWeather("");
    setComment("");
  };

  return (
    <div>
      <h1>Ilari's flight diaries</h1>

      <h2>Add new entry</h2>
      <p style={{ color: "red" }}>{error}</p>
      <form onSubmit={diaryCreation}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          visibility
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="visibility"
              onChange={() => setVisibility("great")}
            />
            great
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              onChange={() => setVisibility("good")}
            />
            good
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              onChange={() => setVisibility("ok")}
            />
            ok
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              onChange={() => setVisibility("poor")}
            />
            poor
          </label>
        </div>

        <div>
          weather
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="weather"
              onChange={() => setWeather("sunny")}
            />
            sunny
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              onChange={() => setWeather("rainy")}
            />
            rainy
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              onChange={() => setWeather("cloudy")}
            />
            cloudy
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              onChange={() => setWeather("stormy")}
            />
            stormy
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              onChange={() => setWeather("windy")}
            />
            windy
          </label>
        </div>

        <div>
          comment
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map((diary) => {
        return (
          <div key={diary.id}>
            <h3>{diary.date}</h3>
            <p>visibility: {diary.visibility}</p>
            <p>weather: {diary.weather}</p>
          </div>
        );
      })}
    </div>
  );
};

export default App;
