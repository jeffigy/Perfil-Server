const TestResult = require("../models/TestResult");

const getAllTestResults = async (_req, res) => {
  const testResults = await TestResult.find({});
  if (testResults.length === 0) {
    return res.status(400).json({ message: "No test resuls found" });
  }

  res.json(testResults);
};

const getAllTestResultsByAppointmentByAppointmentId = async (req, res) => {
  const { apptId } = req.params;
  const testResults = await TestResult.find({ appointment: apptId }).exec();

  if (testResults.length === 0) {
    return res.status(400).json({ message: "No test results found" });
  }
  res.json(testResults);
};

const newTestResult = async (req, res) => {
  const {
    patient,
    appointment,
    examinedBy,
    result,
    diagnosis,
    remarks,
    prescription,
  } = req.body;

  if (!patient || !appointment || !examinedBy || !result) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await TestResult.findOne({ patient, appointment })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate patient result" });
  }

  const testResultObj = {
    patient,
    appointment,
    examinedBy,
    result,
    diagnosis,
    remarks,
    prescription,
  };

  const testResult = await TestResult.create(testResultObj);

  if (testResult) {
    return res.status(201).json({ message: "Test result successfully added" });
  } else {
    return res
      .status(400)
      .json({ message: "Received invalid test result data" });
  }
};

const updateTestResult = async (req, res) => {
  const {
    id,
    patient,
    appointment,
    examinedBy,
    result,
    diagnosis,
    remarks,
    prescription,
  } = req.body;

  if (!id || !patient || !appointment || !examinedBy || !result) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const testResult = await TestResult.findById(id).exec();

  if (!testResult) {
    res.status(400).json({ message: "Test result not found" });
  }

  const duplicate = await TestResult.findOne({ patient, appointment }).exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: "Patient test result already existed" });
  }

  testResult.patient = patient;
  testResult.appointment = appointment;
  testResult.examinedBy = examinedBy;
  testResult.result = result;
  testResult.diagnosis = diagnosis;
  testResult.remarks = remarks;
  testResult.prescription = prescription;

  await testResult.save();

  res.json({ message: "Patient result successfully updated" });
};

const deleteTestResult = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Test result Id is required" });
  }

  const testResult = await TestResult.findById(id).exec();

  if (!testResult) {
    return res.status(409).json({ message: "Test result not found" });
  }

  await testResult.deleteOne();
  res.json({ message: "Test result has been deleted" });
};

module.exports = {
  getAllTestResults,
  getAllTestResultsByAppointmentByAppointmentId,
  newTestResult,
  updateTestResult,
  deleteTestResult,
};
