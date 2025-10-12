const {
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ChannelType
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const CrabCustomReport = require("../../schemas/CrabCustomReports");
const {
  clipboard_list,
  circle_1,
  circle_2,
  circle_3,
  minus_sign,
  back_arrow,
  add_sign
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
    const newCustomReport = new CrabCustomReport({
      crab_ReportName: reportName,
      crab_ReportField1Label: fieldOneName,
      crab_ReportField1PlaceHolder: fieldOnePlaceholder,
      crab_ReportId: customReportID,
      guildId: interaction.guild.id,
    });

    await newCustomReport.save();
    const GuildCustomReports = await CrabCustomReport.find({ guildId: interaction.guild.id })
    const CustomReport = await CrabCustomReport.find({
      crab_ReportId: customReportID,
      guildId: interaction.guild.id
    });
    const ConfigEmbed = new EmbedBuilder()
      .setColor(0xec3935)
      .setTitle("Configure Crab")
      .setImage(
        "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
      )
      .setDescription(
        `You are now configuring the **reports** module of Crab! Below you will find the configuration you will set:\n* **Report Logging**\n  * Select the channel you wish to log your reports in.`
      );
    const ReportLogMenu = new ChannelSelectMenuBuilder()
      .setChannelTypes(ChannelType.GuildText)
      .setCustomId("crab-sm_reports-log")
      .setPlaceholder("Report Logging")
      .setMaxValues(1);
    const CustomReportMenu = new StringSelectMenuBuilder()
      .setCustomId("crab-sm_reports-custom")
      .setPlaceholder("Custom Reports")
      .setMaxValues(1);
    const backButton = new ButtonBuilder()
      .setCustomId("crab-button_back")
      .setEmoji(back_arrow)
      .setLabel("Back")
      .setStyle(ButtonStyle.Success);

    const CustomReportAdd = new StringSelectMenuOptionBuilder()
      .setEmoji(add_sign)
      .setLabel(`Add Custom Report (${GuildCustomReports.length}/3)`)
      .setValue(`report-config_add-custom`);

    CustomReportMenu.addOptions(CustomReportAdd);
    for (let i = 0; i < GuildCustomReports.length; i++) {
      const CustomReport = GuildCustomReports[i];
      const emoji = eval(`circle_${i + 1}`);
      const CustomReportEdit = new StringSelectMenuOptionBuilder()
        .setEmoji(emoji)
        .setLabel(`${CustomReport.crab_ReportName}`)
        .setValue(`report-config_edit:${CustomReport.crab_ReportId}`);
      CustomReportMenu.addOptions(CustomReportEdit);
    }
    const ConfigRow = new ActionRowBuilder().addComponents(ReportLogMenu);
    const ConfigRow2 = new ActionRowBuilder().addComponents(CustomReportMenu);
    const ConfigRow3 = new ActionRowBuilder().addComponents(backButton);
    await interaction.update({
      embeds: [ConfigEmbed],
      components: [ConfigRow, ConfigRow2, ConfigRow3],
    });
    const embed = new EmbedBuilder()
      .setTitle(`Report Customization Panel`)
      .setColor(0xec3935)
      .setDescription(
        `${clipboard_list} **${
          CustomReport.crab_ReportName
        } Report Information**\n> **Field One Name:** ${
          CustomReport.crab_ReportField1Label
        }\n> **Field One Placeholder:** ${
          CustomReport.crab_ReportField1PlaceHolder
        }\n\n> **Field Two Name:** ${
          CustomReport.crab_ReportField2Label || "Not Set"
        }\n> **Field Two Placeholder:** ${
          CustomReport.crab_ReportField2PlaceHolder || "Not Set"
        }\n\n> **Field Three Name:** ${
          CustomReport.crab_ReportField3Label || "Not Set"
        }\n> **Field Three Placeholder:** ${
          CustomReport.crab_ReportField3PlaceHolder || "Not Set"
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
    return await interaction.followUp({
      embeds: [embed],
      components: [row, row2],
      flags: MessageFlags.Ephemeral,
    });
  },
};
