import { CoursePart } from "../types";

interface PartProps {
  part: CoursePart;
}

const Part = (props: PartProps) => {
  return (
    <div>
      <p>
        <strong>
          {props.part.name} {props.part.exerciseCount}
        </strong>
      </p>
      {props.part.kind === "basic" ||
      props.part.kind === "background" ||
      props.part.kind === "special" ? (
        <i>{props.part.description}</i>
      ) : null}
      {props.part.kind === "group" && (
        <p>project exercises {props.part.groupProjectCount}</p>
      )}
      {props.part.kind === "background" && (
        <p>submit to {props.part.backgroundMaterial}</p>
      )}
      {props.part.kind === "special" && (
        <p>required skills {props.part.requirements.join(", ")}</p>
      )}
    </div>
  );
};

export default Part;
