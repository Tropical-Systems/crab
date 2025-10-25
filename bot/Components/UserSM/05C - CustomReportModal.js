const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const CrabCustomReports = require("../../schemas/CrabCustomReports")
module.exports = {
  customIdPrefix: 'crab_custom_report',
  execute: async (interaction) => {
    const [_, reportId] = interaction.values[0].split(":");
    const MIN_CHAR_MODAL = 100
    const MAX_CHAR_MODAL = 256
    const CustomReport = await CrabCustomReports.findOne({ guildId: interaction.guild.id, crab_ReportId: reportId })
    const modal = new ModalBuilder()
    .setTitle(CustomReport.crab_ReportName)
    .setCustomId(`crab_modal-custom_report:${CustomReport.crab_ReportId}`)

    const Field1 = new TextInputBuilder()
      .setLabel(CustomReport.crab_ReportField1Label)
      .setPlaceholder(CustomReport.crab_ReportField1PlaceHolder)
      .setCustomId("crab_input-field-1")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(MIN_CHAR_MODAL)
      .setMaxLength(MAX_CHAR_MODAL);
    const Field2 = new TextInputBuilder()
      .setLabel(CustomReport.crab_ReportField2Label || "Not set")
      .setPlaceholder(CustomReport.crab_ReportField2PlaceHolder || "Not set")
      .setCustomId("crab_input-field-2")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setRequired(true)
      .setMinLength(MIN_CHAR_MODAL)
      .setMaxLength(MAX_CHAR_MODAL);
    const Field3 = new TextInputBuilder()
      .setLabel(CustomReport.crab_ReportField3Label || "Not set")
      .setPlaceholder(CustomReport.crab_ReportField3PlaceHolder || "Not set")
      .setCustomId("crab_input-field-3")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMinLength(MIN_CHAR_MODAL)
      .setMaxLength(MAX_CHAR_MODAL);
    const row1 = new ActionRowBuilder().addComponents(Field1)
    modal.addComponents(row1)
    if (CustomReport.crab_ReportField2Label && CustomReport.crab_ReportField2PlaceHolder) {
      const row2 = new ActionRowBuilder().addComponents(Field2)
      modal.addComponents(row2)
    } 
    if (CustomReport.crab_ReportField2Label && CustomReport.crab_ReportField2PlaceHolder) {
      const row3 = new ActionRowBuilder().addComponents(Field3)
      modal.addComponents(row3)
    }
    await interaction.showModal(modal)
  }
}

