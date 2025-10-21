const { Schema, model } = require('mongoose')

const CrabShiftType = new Schema({
  allowedRoles: {
    type: Array,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  type_id: {
    type: String,
    required: false,
  },
  guildId: {
    type: String,
    required: true,
  },
})
const crabShiftTypeConfig = model("Shift Type Configuration", CrabShiftType);

module.exports = crabShiftTypeConfig;
