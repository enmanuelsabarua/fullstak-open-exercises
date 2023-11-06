interface ExercisesValues {
  hours: number[];
  target: number;
}

const parseCLIArguments = (args: string[]): ExercisesValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const [, , ...numberArgs]: string[] = args;

  numberArgs.forEach((number) => {
    if (isNaN(Number(number))) {
      throw new Error("Provided values are not numbers!");
    }
  });

  const [target, ...hours]: string[] = numberArgs;

  return {
    hours: hours.map((hour) => Number(hour)),
    target: Number(target),
  };
};

interface ExercisesResults {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
}

export const calculateExercises = (
  hours: number[],
  target: number
): ExercisesResults => {
  const average: number =
    hours.reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
    hours.length;

  let rating: number = 0;
  let ratingDescription: string = '';

  if (average < target / 2) {
    rating = 1;
    ratingDescription = "should improve your exercises hours";
  } else if (average >= target / 2 && average < target) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else if (average >= target) {
    rating = 3;
    ratingDescription = "excellent, you meet the target";
  }

  return {
    periodLength: hours.length,
    trainingDays: hours.filter((h) => h !== 0).length,
    target,
    average,
    success: average >= target ? true : false,
    rating,
    ratingDescription,
  };
};

try {
  const { hours, target } = parseCLIArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }

  console.log(errorMessage);
}
