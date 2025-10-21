const { EmbedBuilder, inlineCode, MessageFlags } = require("discord.js");
const CrabShiftType = require("../../schemas/CrabShiftType");
const CrabConfig = require('../../schemas/CrabConfig')
const { check } = require("../../../emojis.json");
const randomId = require("../../Functions/customReportId");
module.exports = {
  customIdPrefix: "crab_modal-shift_type",
  execute: async (interaction, client) => {
    const [_, typeNumber] = interaction.customId.split(":");
    const typeName = interaction.fields.getTextInputValue(
      "crab_input-shift_type_name"
    );
    const authorizedRolesObj = interaction.fields.getSelectedRoles(
      "crab_select-shift_type_roles"
    );
    let authorizedRoles = authorizedRolesObj.map(role => role.id)
    const customShiftTypeId = randomId(10, "0123456789");
    const newShiftType = new CrabShiftType({
      allowedRoles: authorizedRoles,
      guildId: interaction.guild.id,
      type_id: customShiftTypeId,
      name: typeName
    })
    await CrabConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $set: { shift_Types: typeName } },
      { upsert: true, new: true }
    )

    await newShiftType.save()
    interaction.reply({ content: `${check} I have added ${inlineCode(typeName)} as a new shift type.`, flags: MessageFlags.Ephemeral })
  },
};
