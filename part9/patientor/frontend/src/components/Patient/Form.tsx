import { useState } from "react";
import patientService from "../../services/patients";
import {
  Diagnosis,
  EntryWithoutId,
  HealthCheckRating,
  Patient,
} from "../../types";
import axios from "axios";

interface Props {
  patient: Patient | undefined;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  diagnoses: Diagnosis[];
}

const Form = ({ patient, setPatient, setError, diagnoses }: Props) => {
  const [entryType, setEntryType] = useState<string>("Hospital");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<
    Array<Diagnosis["code"]>
  >([]);
  const [diagnosisCode, setDiagnosisCode] = useState<Diagnosis["code"]>("");

  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(0);

  const [employerName, setEmployerName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [dischargeDate, setDischargeDate] = useState<string>("");
  const [criteria, setCriteria] = useState<string>("");

  const handleAddEntry = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    let newEntry = {};
    switch (entryType) {
      case "Hospital":
        newEntry = {
          type: "Hospital",
          description,
          date,
          specialist,
          diagnosisCodes,
          discharge: {
            date: dischargeDate,
            criteria,
          },
        };

        setDescription("");
        setSpecialist("");
        setCriteria("");
        setDiagnosisCodes([]);
        break;
      case "HealthCheck":
        newEntry = {
          type: "HealthCheck",
          description,
          date,
          specialist,
          diagnosisCodes,
          healthCheckRating,
        };
        setDescription("");
        setSpecialist("");
        setDiagnosisCodes([]);

        break;
      case "OccupationalHealthcare":
        newEntry = {
          type: "OccupationalHealthcare",
          description,
          date,
          specialist,
          diagnosisCodes,
          employerName,
          sickLeave: {
            startDate,
            endDate,
          },
        };
        setDescription("");
        setSpecialist("");
        setEmployerName("");
        setDiagnosisCodes([]);

        break;

      default:
        setError("Invalid type");
        break;
    }
    try {
      const newPatient = await patientService.createEntry(
        patient?.id,
        newEntry as EntryWithoutId
      );

      setPatient(newPatient);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.log(e);

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
        setError("");
      }, 5000);
    }
  };

  const clearInputs = () => {
    setDescription("");
    setSpecialist("");
    setCriteria("");
    setEmployerName("");
    setDiagnosisCodes([]);
  };

  const addCode = () => {
    setDiagnosisCodes([...diagnosisCodes, diagnoses[0].code]);
    if (diagnosisCode) {
      setDiagnosisCodes([...diagnosisCodes, diagnosisCode]);
    }
  };

  return (
    <form
      style={{ padding: "10px", border: "4px dotted black" }}
      onSubmit={handleAddEntry}
    >
      <h2>New Entry</h2>
      <div>
        <label htmlFor="description">
          Entry Type
          <select
            onChange={({ target }) => setEntryType(target.value)}
            name="type"
            id="type"
          >
            <option value="Hospital">Hospital</option>
            <option value="OccupationalHealthcare">
              OccupationalHealthcare
            </option>
            <option value="HealthCheck">HealthCheck</option>
          </select>
        </label>
      </div>

      <div>
        <label htmlFor="description">
          Description
          <input
            name="description"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="date">
          Date
          <input
            type="date"
            name="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="specialist">
          Specialist
          <input
            name="specialist"
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="diagnosisCode">
          Diagnosis Codes
          <input disabled value={diagnosisCodes} />
          <select
            onChange={({ target }) => setDiagnosisCode(target.value)}
            name="type"
            id="type"
          >
            {diagnoses.map((diagnosis) => (
              <option key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={addCode}>
          add code
        </button>
      </div>

      {entryType === "Hospital" ? (
        <div>
          <h3>Discharge</h3>
          <div>
            <label htmlFor="dischargeDate">
              Date
              <input
                type="date"
                name="dischargeDate"
                value={dischargeDate}
                onChange={({ target }) => setDischargeDate(target.value)}
              />
            </label>
          </div>
          <div>
            <label htmlFor="criteria">
              Criteria
              <input
                name="dischargeDate"
                value={criteria}
                onChange={({ target }) => setCriteria(target.value)}
              />
            </label>
          </div>
        </div>
      ) : entryType === "HealthCheck" ? (
        <div>
          <div>
            <label htmlFor="healthCheckRating">
              Health Check Rating
              <select
                onChange={({ target }) =>
                  setHealthCheckRating(Number(target.value))
                }
                name="healthCheckRating"
                id="healthCheckRating"
              >
                <option value={0}>Healthy</option>
                <option value={1}>LowRisk</option>
                <option value={2}>HighRisk</option>
                <option value={3}>CriticalRisk</option>
              </select>
            </label>
          </div>
        </div>
      ) : (
        entryType === "OccupationalHealthcare" && (
          <div>
            <div>
              <label htmlFor="employerName">
                Employer Name
                <input
                  name="employerName"
                  value={employerName}
                  onChange={({ target }) => setEmployerName(target.value)}
                />
              </label>
            </div>
            <h3>Sick Leave</h3>
            <div>
              <label htmlFor="startDate">
                Start
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={startDate}
                  onChange={({ target }) => setStartDate(target.value)}
                />
              </label>
            </div>
            <div>
              <label htmlFor="endDate">
                End
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={endDate}
                  onChange={({ target }) => setEndDate(target.value)}
                />
              </label>
            </div>
          </div>
        )
      )}

      <button onClick={clearInputs}>Cancel</button>
      <button type="submit">Add</button>
    </form>
  );
};

export default Form;
