const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js')
const { back_arrow, x, settings } = require("../../../emojis.json")
const CrabCustomReports = require("../../schemas/CrabCustomReports")
module.exports = {
  customId: 'custom-report-add_modal-config',
  execute: async (interaction) => {
    const modal = new ModalBuilder()
    .setTitle("Custom Report Customization")
    .setCustomId("custom-report-add_customize-information")
    
    const reportName = new TextInputBuilder()
    .setCustomId("crab-text_report-name")
    .setLabel("Report Name:")
    .setPlaceholder("e.g. Accident Report")
    .setRequired(true)
    .setMaxLength(20)
    .setStyle(TextInputStyle.Short)
    const field1Name = new TextInputBuilder()
    .setCustomId("crab-text_report-field-1-title")
    .setLabel("Report Field One Title:")
    .setPlaceholder("e.g. Report Description")
    .setRequired(true)
    .setMaxLength(20)
    .setStyle(TextInputStyle.Short)
    const field1Placeholder = new TextInputBuilder()
    .setCustomId("crab-text_report-field-1-placeholder")
    .setLabel("Report Field One Placeholder:")
    .setPlaceholder("e.g. Please type a full description of this report.")
    .setRequired(true)
    .setMaxLength(100)
    .setStyle(TextInputStyle.Paragraph)

    const reportNameField = new ActionRowBuilder().addComponents(reportName)
    const field1Title = new ActionRowBuilder().addComponents(field1Name)
    const field1PlaceholderText = new ActionRowBuilder().addComponents(field1Placeholder)

    modal.addComponents(reportNameField, field1Title, field1PlaceholderText)

    await interaction.showModal(modal)
  }
}
