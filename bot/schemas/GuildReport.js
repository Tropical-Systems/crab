const { Schema, model } = require('mongoose')

const GuildReport = new Schema({
  ReportType: {
    type: String,
    required: false
  },
  Description: {
    type: String,
    required: false
  },
  custom_field1: {
    type: String,
    required: false
  },
  custom_field2: {
    type: String,
    required: false
  },
  custom_field3: {
    type: String,
    required: false
  },
  custom_reportId: {
    type: String,
    requried: false,
  },
  IssuedBy: {
    type: String,
    required: false
  },
  ReviewedBy: {
    type: String,
    required: false
  },
  id: {
    type: String,
    required: false
  },
  messageId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true,
  },
})
const guildReport = model("Reports", GuildReport);

module.exports = guildReport;
