import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { HealthCheckEntry } from "../../../types";

interface Props {
  entry: HealthCheckEntry;
  styles: object;
}

const HealthCheck = ({ entry, styles }: Props) => {  
  return (
    <div style={styles}>
      <h4>
        {entry.date} <MedicalInformationIcon />
      </h4>
      <i>{entry.description}</i>
      <div>
        <FavoriteIcon style={entry.healthCheckRating === 0 ? {color: 'green'} : entry.healthCheckRating === 1 ? {color: 'yellow'} : {color: 'red'}}/>

      </div>
      <p>Diagnose by {entry.specialist}</p>
    </div>
  );
};

export default HealthCheck;
