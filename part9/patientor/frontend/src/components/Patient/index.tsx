import { useParams } from "react-router-dom";
import { Diagnosis, Patient } from "../../types";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import axios from "axios";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import EntryDetails from "./EntryDetails";
import Form from "./Form";

interface Props {
  diagnoses: Diagnosis[]
}

const PatientInfo = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const [error, setError] = useState<string>("");
  const id = useParams().id;

  useEffect(() => {
    const fetchOnePatient = async () => {
      try {
        const patient = await patientService.getOne(id);

        setPatient(patient);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.log(error);

          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace(
              "Something went wrong. Error: ",
              ""
            );
            console.error(message);
            setError(message);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    };

    void fetchOnePatient();
  }, [id]);

  return (
    <div>
      {error && (
        <div
          style={{
            backgroundColor: "#eb7373",
            border: "2px solid red",
            marginTop: "10px",
            padding: "0 10px",
            borderRadius: "5px",
            color: "white"
          }}
        >
          <p>{error}</p>
        </div>
      )}

      <h2>
        {patient?.name}{" "}
        {patient?.gender === "male" ? <MaleIcon /> : <FemaleIcon />}
      </h2>
      <p>ssh: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>

      <Form diagnoses={diagnoses} patient={patient} setPatient={setPatient} setError={setError} />

      <h3>Entries</h3>
      {patient?.entries.map((entry) => {
        return <EntryDetails key={entry.id} entry={entry} />;
      })}
    </div>
  );
};

export default PatientInfo;
