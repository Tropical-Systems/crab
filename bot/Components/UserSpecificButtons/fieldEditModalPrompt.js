const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");


module.exports = {
  customIdPrefix: "crab_button-custom_report-field-edit",
  execute: async (interaction, client) => {
    const [_, reportId, fieldNumber] = interaction.customId.split(":")

    const modal = new ModalBuilder()
      .setCustomId(`crab_modal-report_field_edit:${reportId}:${fieldNumber}`)
      .setTitle(`Edit Field ${fieldNumber}`);
      
    const FieldLabel = new TextInputBuilder()
    .setCustomId(`crab_input-field-label-edit`)
    .setLabel("Set the Field Label")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder("E.g. Description of Accident")
    const FieldPlaceholder = new TextInputBuilder()
    .setCustomId(`crab_input-field-placeholder-edit`)
    .setLabel("Set the Field Placeholder")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Type your desired placeholder..")
    .setRequired(true)

    const row1 = new ActionRowBuilder().addComponents(FieldLabel)
    const row2 = new ActionRowBuilder().addComponents(FieldPlaceholder)

    modal.addComponents(row1, row2)
    await interaction.showModal(modal)
}
};
