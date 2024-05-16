const testResultRoutes = require("express").Router();
const testResultsController = require("../controllers/testResultsController");

testResultRoutes
  .route("/")
  .get(testResultsController.getAllTestResults)
  .post(testResultsController.newTestResult)
  .patch(testResultsController.updateTestResult)
  .delete(testResultsController.deleteTestResult);

module.exports = testResultRoutes;
