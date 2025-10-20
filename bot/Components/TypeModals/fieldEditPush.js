const { EmbedBuilder } = require('discord.js')
const crabCustomReports = require("../../schemas/CrabCustomReports");
const { clipboard_list } = require("../../../emojis.json")
module.exports = {
  customIdPrefix: 'crab_modal-report_field_edit',
  execute: async (interaction, client) => {
    const [_, reportId, fieldNumber] = interaction.customId.split(":")
    const CustomReport =  await crabCustomReports.findOne({ guildId: interaction.guild.id, crab_ReportId: reportId })
    const fieldLabel = interaction.fields.getTextInputValue("crab_input-field-label-edit")
    const fieldPlaceholder = interaction.fields.getTextInputValue("crab_input-field-placeholder-edit")
    const embed = new EmbedBuilder()
      .setTitle(`Report Customization Panel`)
      .setColor(0xec3935)

    if (fieldNumber == "1"){
      await CustomReport.updateOne({ crab_ReportField1Label: fieldLabel, crab_ReportField1PlaceHolder: fieldPlaceholder })
      embed.setDescription(`${clipboard_list} **${CustomReport.crab_ReportName} Report Information**\n> **Field One Name:** ${fieldLabel}\n> **Field One Placeholder:** ${fieldPlaceholder}\n\n> **Field Two Name:** ${CustomReport.crab_ReportField2Label || "Not Set"}\n> **Field Two Placeholder:** ${CustomReport.crab_ReportField2PlaceHolder || "Not Set"}\n\n> **Field Three Name:** ${CustomReport.crab_ReportField3Label || "Not Set"}\n> **Field Three Placeholder:** ${CustomReport.crab_ReportField3PlaceHolder || "Not Set"}`)
      interaction.update({ embeds: [embed] })
    } else if (fieldNumber == "2") {
      await CustomReport.updateOne({ crab_ReportField2Label: fieldLabel, crab_ReportField2PlaceHolder: fieldPlaceholder })
      embed.setDescription(`${clipboard_list} **${CustomReport.crab_ReportName} Report Information**\n> **Field One Name:** ${CustomReport.crab_ReportField1Label}\n> **Field One Placeholder:** ${CustomReport.crab_ReportField1PlaceHolder}\n\n> **Field Two Name:** ${fieldLabel}\n> **Field Two Placeholder:** ${fieldPlaceholder}\n\n> **Field Three Name:** ${CustomReport.crab_ReportField3Label || "Not Set"}\n> **Field Three Placeholder:** ${CustomReport.crab_ReportField3PlaceHolder || "Not Set"}`)
      interaction.update({ embeds: [embed] })
    } else if (fieldNumber == "3") {
      await CustomReport.updateOne({ crab_ReportField3Label: fieldLabel, crab_ReportField3PlaceHolder: fieldPlaceholder })
      embed.setDescription(`${clipboard_list} **${CustomReport.crab_ReportName} Report Information**\n> **Field One Name:** ${CustomReport.crab_ReportField1Label}\n> **Field One Placeholder:** ${CustomReport.crab_ReportField1PlaceHolder}\n\n> **Field Two Name:** ${CustomReport.crab_ReportField2Label || "Not Set"}\n> **Field Two Placeholder:** ${CustomReport.crab_ReportField2PlaceHolder || "Not Set"}\n\n> **Field Three Name:** ${fieldLabel}\n> **Field Three Placeholder:** ${fieldPlaceholder}`)
      interaction.update({ embeds: [embed] })
    }
  }
}
