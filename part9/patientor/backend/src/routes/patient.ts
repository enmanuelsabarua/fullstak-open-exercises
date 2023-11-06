import express from "express";
import patientService from "../services/patientService";
import parsers from "../utils";
const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNonSensitivePatientEntries());
});

router.get('/:id', (req, res) => {
  const result = patientService.getOnePatient(req.params.id);
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({error: 'patient not found'});
  }

});

router.post("/", (req, res) => {
  try {
    const newPatientEntry = parsers.toNewPatientEntry(req.body);

    const addedEntry = patientService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const newPEntry = parsers.toNewEntry(req.body);

    const addedEntry = patientService.addEntry(req.params.id, newPEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
