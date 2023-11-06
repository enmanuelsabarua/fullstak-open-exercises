import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import { OccupationalHealthcareEntry } from "../../../types";

interface Props {
  entry: OccupationalHealthcareEntry;
  styles: object;
}

const OccupationalHealthcare = ({ entry, styles }: Props) => {
  return (
    <div style={styles}>
      <h4>
        {entry.date} <SelfImprovementIcon />
      </h4>
      <i>{entry.description}</i>
      <p>Diagnose by {entry.specialist}</p>
    </div>
  );
};

export default OccupationalHealthcare;
