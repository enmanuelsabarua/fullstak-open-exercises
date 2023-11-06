interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values are not numbers!");
  }
};

const calculateBmi = (height: number, weight: number): string => {
  const meters = height / 100;
  const bmi: number = weight / (meters * meters);

  if (bmi < 25) {
    return "Normal (healthy weight)";
  } else if (bmi >= 25 && bmi <= 29) {
    return "Overweight (high weight)";
  } else {
    return "Obese (bad weight)";
  }
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }

  console.log(errorMessage);
}

export default calculateBmi;