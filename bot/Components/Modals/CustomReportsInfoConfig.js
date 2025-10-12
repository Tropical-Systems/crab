const {
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const CustomReport = require("../../schemas/CrabCustomReports");
const {
  clipboard_list,
  circle_1,
  circle_2,
  circle_3,
  minus_sign
} = require("../../../emojis.json");
const randomId = require("../../Functions/customReportId");
module.exports = {
  customId: "custom-report-add_customize-information",
  execute: async (interaction) => {
    const reportName = interaction.fields.getTextInputValue(
      "crab-text_report-name"
    );
    const fieldOneName = interaction.fields.getTextInputValue(
      "crab-text_report-field-1-title"
    );
    const fieldOnePlaceholder = interaction.fields.getTextInputValue(
      "crab-text_report-field-1-placeholder"
    );
    const customReportID = randomId(10, "0123456789");
    const newCustomReport = new CustomReport({
      crab_ReportName: reportName,
      crab_ReportField1Label: fieldOneName,
      crab_ReportField1PlaceHolder: fieldOnePlaceholder,
      crab_ReportId: customReportID,
      guildId: interaction.guild.id,
    });

    await newCustomReport.save();
    const CustomReportLog = await CustomReport.findOne({
      crab_ReportId: customReportID,
    });
    const embed = new EmbedBuilder()
      .setTitle(`Report Customization Panel`)
      .setColor(0xec3935)
      .setDescription(
        `${clipboard_list} **${
          CustomReportLog.crab_ReportName
        } Report Information**\n> **Field One Name:** ${
          CustomReportLog.crab_ReportField1Label
        }\n> **Field One Placeholder:** ${
          CustomReportLog.crab_ReportField1PlaceHolder
        }\n\n> **Field Two Name:** ${
          CustomReportLog.crab_ReportField2Label || "Not Set"
        }\n> **Field Two Placeholder:** ${
          CustomReportLog.crab_ReportField2PlaceHolder || "Not Set"
        }\n\n> **Field Three Name:** ${
          CustomReportLog.crab_ReportField3Label || "Not Set"
        }\n> **Field Three Placeholder:** ${
          CustomReportLog.crab_ReportField3PlaceHolder || "Not Set"
        }`
      );

    const FieldOneEdit = new ButtonBuilder()
      .setCustomId(`crab_button-custom_report-field-edit:${customReportID}:1`)
      .setEmoji(circle_1)
      .setLabel("Field One")
      .setStyle(ButtonStyle.Secondary);
    const FieldTwoEdit = new ButtonBuilder()
      .setCustomId(`crab_button-custom_report-field-edit:${customReportID}:2`)
      .setEmoji(circle_2)
      .setLabel("Field Two")
      .setStyle(ButtonStyle.Secondary);
    const FieldThreeEdit = new ButtonBuilder()
      .setCustomId(`crab_button-custom_report-field-edit:${customReportID}:3`)
      .setEmoji(circle_3)
      .setLabel("Field Three")
      .setStyle(ButtonStyle.Secondary);
    const RemoveCustomReport = new ButtonBuilder()
      .setCustomId(
        `crab_button-custom_report-remove:${customReportID}:${interaction.message.id}`
      )
      .setEmoji(minus_sign)
      .setLabel("Remove Custom Report")
      .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder().addComponents(
      FieldOneEdit,
      FieldTwoEdit,
      FieldThreeEdit
    );
    const row2 = new ActionRowBuilder().addComponents(RemoveCustomReport);
    return await interaction.reply({
      embeds: [embed],
      components: [row, row2],
      flags: MessageFlags.Ephemeral,
    });
  },
};
