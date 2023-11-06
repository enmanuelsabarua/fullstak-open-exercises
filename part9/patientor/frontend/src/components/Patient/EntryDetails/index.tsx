import { Entry } from "../../../types";
import HealthCheck from "./HealthCheck";
import Hospital from "./Hospital";
import OccupationalHealthcare from "./OccupationalHealthcare";

interface Props {
  entry: Entry;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: Props) => {
  const styles = {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '0 5px',
    marginBottom: '10px'
  };

  switch (entry.type) {
    case "Hospital":
      return <Hospital styles={styles} entry={entry} />;
    case "HealthCheck":
      return <HealthCheck styles={styles} entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcare styles={styles} entry={entry} />;

    default:
      assertNever(entry);
  }
};

export default EntryDetails;
