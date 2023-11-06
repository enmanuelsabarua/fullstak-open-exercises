import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { HospitalEntry } from "../../../types";

interface Props {
  entry: HospitalEntry;
  styles: object;
}

const Hospital = ({ entry, styles }: Props) => {
  return (
    <div style={styles}>
      <h4>
        {entry.date} <LocalHospitalIcon />
      </h4>
      <i>{entry.description}</i>
      <p>Diagnose by {entry.specialist}</p>
    </div>
  );
};

export default Hospital;
