import { CoursePart } from "../types";
import Part from "./Part";

interface ContentProp {
  courseParts: CoursePart[];
}

const Content = (props: ContentProp) => {
  const parts: JSX.Element[] = [];
  try {
    props.courseParts.forEach((part) => {
      switch (part.kind) {
        case "basic":
          parts.push(<Part key={part.name} part={part} />);
          break;
        case "group":
          parts.push(<Part key={part.name} part={part} />);
          break;
        case "background":
          parts.push(<Part key={part.name} part={part} />);
          break;
        case "special":
          parts.push(<Part key={part.name} part={part} />);
          break;

        default:
          assertNever(part);
      }
    });
  } catch (error: unknown) {
    let errorMessage = "Something went wrong";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return errorMessage;
  }

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  return parts;
};

export default Content;
