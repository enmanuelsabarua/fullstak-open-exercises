import calculateBmi from "./bmiCalculator";
import express from "express";
import { calculateExercises } from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  const heightParsed = Number(height);
  const weightParsed = Number(weight);

  if (!height || !weight || isNaN(heightParsed) || isNaN(weightParsed)) {
    res.json({ error: "malformatted parameters" });
  } else {
    const bmi = calculateBmi(heightParsed, weightParsed);
    const responseObject = {
      height: heightParsed,
      weight: weightParsed,
      bmi,
    };

    res.json(responseObject);
  }
});

app.post("/exercises", (req, res) => {  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({
      error: 'parameters missing'
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  daily_exercises.forEach((hours: number) => {
    if (isNaN(Number(hours)) || isNaN(Number(target))) {
      res.status(400).json({
        error: 'malformatted parameters'
      });
    }
  });

  const result = calculateExercises(daily_exercises as number[], target as number);
  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
