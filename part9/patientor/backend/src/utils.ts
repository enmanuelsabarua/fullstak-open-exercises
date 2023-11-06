import {
  NewPatientEntry,
  Gender,
  EntryWithoutId,
  Diagnosis,
  Discharge,
  HealthCheckRating,
  SickLeave,
} from "./types";

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGenre(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };

    return newEntry;
  }

  throw new Error("Incorrect data: some fields are missing");
};

const parseName = (name: unknown): string => {
  if (!isString(name) || !name) {
    throw new Error("Incorrect or missing information");
  }

  return name;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseSSN = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Incorrect or missing comment");
  }

  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error("Incorrect or missing comment");
  }

  return occupation;
};

const parseGenre = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing comment");
  }

  return gender;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

// Entry parsers
const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "description" in object &&
    "date" in object &&
    "specialist" in object &&
    "diagnosisCodes" in object &&
    "type" in object
  ) {
    switch (object.type) {
      case "Hospital":
        if ("discharge" in object) {
          const newDischarge: Discharge = object.discharge as Discharge;

          const newEntry: EntryWithoutId = {
            type: object.type,
            description: parseName(object.description),
            date: parseDate(object.date),
            specialist: parseName(object.specialist),
            diagnosisCodes: parseDiagnosisCodes(object),
            discharge: newDischarge,
          };
          return newEntry;
        }
        break;
      case "HealthCheck":
        if ("healthCheckRating" in object) {
          const newEntry: EntryWithoutId = {
            type: object.type,
            description: parseName(object.description),
            date: parseDate(object.date),
            specialist: parseName(object.specialist),
            diagnosisCodes: parseDiagnosisCodes(object),
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
          };
          return newEntry;
        }
      
        break;
      case "OccupationalHealthcare":
        if ("employerName" in object && "sickLeave" in object) {
          const newSickLeave: SickLeave = object.sickLeave as SickLeave;

          const newEntry: EntryWithoutId = {
            type: object.type,
            description: parseName(object.description),
            date: parseDate(object.date),
            specialist: parseName(object.specialist),
            diagnosisCodes: parseDiagnosisCodes(object),
            employerName: parseName(object.employerName),
            sickLeave: newSickLeave,
          };
          return newEntry;
        }
        break;

      default:
        throw new Error("Incorrect data: the type does not exist");
    }
  }

  throw new Error("Incorrect data: some fields are missing");
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const parseHealthCheckRating = (param: unknown) => {
  if (!isNumber(param) || !isHealthCheckRating(Number(param))) {
    throw new Error("Value of HealthCheckRating incorrect: " + param);
  }

  return param;
};

const isNumber = (param: unknown): param is number => {  
  return !isNaN(Number(param));
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {

  return Object.values(HealthCheckRating).includes(param);
};

export default { toNewPatientEntry, toNewEntry };
