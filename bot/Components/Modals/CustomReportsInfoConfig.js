const { EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const CrabConfig = require("../../schemas/CrabConfig")
const CustomReport = require("../../schemas/CrabCustomReports")
const { clipboard_list, circle_1, circle_2, circle_3, circle_4, circle_5 } = require("../../../emojis.json")
const randomId = require("../../Functions/customReportId")
module.exports = {
  customId: "custom-report-add_customize-information",
  execute: async (interaction) => {
    const reportName = interaction.fields.getTextInputValue("crab-text_report-name")
    const fieldOneName = interaction.fields.getTextInputValue("crab-text_report-field-1-title")
    const fieldOnePlaceholder = interaction.fields.getTextInputValue("crab-text_report-field-1-placeholder")
    const customReportID = randomId(10, "0123456789")
    const newCustomReport = new CustomReport({
      crab_ReportName: reportName,
      crab_ReportField1Label: fieldOneName,
      crab_ReportField1PlaceHolder: fieldOnePlaceholder,
      crab_ReportId: customReportID,
      guildId: interaction.guild.id
    })

    await newCustomReport.save()
    const embed = new EmbedBuilder()
    .setTitle(`Report Customization Panel`)
    .setColor(0xec3935)
    .setDescription(`${clipboard_list} **${reportName} Report Information**\n> **Field One Name:** ${fieldOneName}\n> **Field One Placeholder:** ${fieldOnePlaceholder}\n--\n> **Field One Name:** ${fieldOneName}\n> **Field One Placeholder:** ${fieldOnePlaceholder}\n--`)
    
    const FieldOneEdit = new ButtonBuilder()
    .setCustomId(`crab_button-custom_report-field-one-edit`)
    .setEmoji(circle_1)
    .setLabel("Field One")
    .setStyle(ButtonStyle.Secondary)
    const FieldTwoEdit = new ButtonBuilder()
    .setCustomId(`crab_button-custom_report-field-two-edit`)
    .setEmoji(circle_2)
    .setLabel("Field Two")
    .setStyle(ButtonStyle.Secondary)
    const FieldThreeEdit = new ButtonBuilder()
    .setCustomId(`crab_button-custom_report-field-three-edit`)
    .setEmoji(circle_3)
    .setLabel("Field Three")
    .setStyle(ButtonStyle.Secondary)
    const row = new ActionRowBuilder().addComponents(FieldOneEdit, FieldTwoEdit, FieldThreeEdit)
    await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral })
  }
}
