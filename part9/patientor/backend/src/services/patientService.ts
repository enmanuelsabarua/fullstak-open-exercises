import { NewPatientEntry, NonSensitivePatientEntry, Patient, EntryWithoutId } from "../types";
import patients from "../../data/patients";
import { v1 as uuid } from "uuid";

const getNonSensitivePatientEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getOnePatient = (id: string): Patient | undefined => {
  const response = patients.find((p) => p.id === id);
  return response;
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (id: string, entry: EntryWithoutId): Patient | undefined => {
  const entryId = uuid();
  const newEntry = {
    id: entryId,
    ...entry
  };

  const patient = patients.find(p => p.id === id);
  patient?.entries.push(newEntry);

  return patient;
};

export default {
  getNonSensitivePatientEntries,
  addPatient,
  getOnePatient,
  addEntry
};
