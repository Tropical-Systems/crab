const { EmbedBuilder, inlineCode, MessageFlags } = require("discord.js");
const CrabShiftType = require("../../schemas/CrabShiftType");
const CrabConfig = require('../../schemas/CrabConfig')
const { check } = require("../../../emojis.json");
const randomId = require("../../Functions/customReportId");
module.exports = {
  customIdPrefix: "crab_modal-shift_type_edit",
  execute: async (interaction, client) => {
    const [_, typeId] = interaction.customId.split(":");
    const typeName = interaction.fields.getTextInputValue(
      "crab_input-shift_type_name"
    ) || null
    const authorizedRolesObj = interaction.fields.getSelectedRoles(
      "crab_select-shift_type_roles"
    ) || null
    const ShiftType = await CrabShiftType.findOne({ guildId: interaction.guild.id, type_id: typeId })
    if (typeName !== null) {
      await CrabConfig.findOneAndUpdate(
        { guildId: interaction.guild.id },
        { $set: { shift_Types: typeName } },
        { upsert: true, new: true }
      )
      await ShiftType.updateOne(
        { $set: { name: typeName }, },
      )
    }
    if (authorizedRolesObj !== null) {
      let authorizedRoles = authorizedRolesObj.map(role => role.id)
      await ShiftType.updateOne(
        { $set: { allowedRoles: authorizedRoles }, },
      )
    }
    if (typeName == null && authorizedRolesObj == null) {
      return await interaction.followUp({ content: `${check} I have **not** edited ${inlineCode(ShiftType.name)}.`, flags: MessageFlags.Ephemeral })
    }


    return await interaction.followUp({ content: `${check} I have edited ${inlineCode(ShiftType.name)} successfully.`, flags: MessageFlags.Ephemeral })
  },
};
