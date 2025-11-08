const { Schema, model } = require('mongoose')

const CrabCustomReports = new Schema({
  crab_ReportName: {
    type: String,
    required: true,
  },
  crab_ReportField1Label: {
    type: String,
    required: true,
  },
  crab_ReportId: {
    type: String,
    required: true,
  },
  crab_ReportField2Label: {
    type: String,
    required: false,
  },
  crab_ReportField3Label: {
    type: String,
    required: false,
  },
  crab_ReportField1PlaceHolder: {
    type: String,
    required: true,
  },
  crab_ReportField2PlaceHolder: {
    type: String,
    required: false,
  },
  crab_ReportField3PlaceHolder: {
    type: String,
    required: false,
  },
  guildId: {
    type: String,
    required: true,
  },
})
const crabCustomReports = model("Custom Reports", CrabCustomReports);

module.exports = crabCustomReports;
