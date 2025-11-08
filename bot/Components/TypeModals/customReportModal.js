const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, AttachmentBuilder } = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const crabCustomReports = require("../../schemas/CrabCustomReports");
const GuildReport = require("../../schemas/GuildReport");
const randomString = require("../../Functions/randomId")
const { clipboard_list, check } = require("../../../emojis.json");
module.exports = {
  customIdPrefix: "crab_modal-custom_report",
  execute: async (interaction, client) => {
    const [_, customReportId] = interaction.customId.split(":");
    const GuildConfig = await CrabConfig.findOne({
      guildId: interaction.guild.id,
    });
    const CustomReport = await crabCustomReports.findOne({
      guildId: interaction.guild.id,
      crab_ReportId: customReportId,
    });
    const field1 = interaction.fields.getTextInputValue("crab_input-field-1");
    let field2 = null;
    let field3 = null;
    if (CustomReport.crab_ReportField2Label) {
      field2 = interaction.fields
      .getTextInputValue("crab_input-field-2")
    }
    if (CustomReport.crab_ReportField3Label) {
      field3 = interaction.fields.getTextInputValue("crab_input-field-3")
    }
    const ReportID = `report_${randomString(
      24,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )}`;
    const SupervisorRole = GuildConfig.perms_SupervisorRole;
    const file = new AttachmentBuilder("bot/Images/embed-banner.png")
    
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `@${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor(0xec3935)
      .setFooter({ text: `Report ID: ${ReportID} || Powered by Crab` })
      .setDescription(
        `Below are details of the ${CustomReport.crab_ReportName} report submitted by ${interaction.user}.`
      )
      .setImage(
        "attachment://embed-banner.png"
      )
      .setTitle(CustomReport.crab_ReportName)
      .addFields({
        name: CustomReport.crab_ReportField1Label,
        value: `${field1}`,
      });
    if (field2) {
      embed.addFields({
        name: CustomReport.crab_ReportField2Label,
        value: `${field2}`,
      });
    }
    if (field3) {
      embed.addFields({
        name: CustomReport.crab_ReportField3Label,
        value: `${field3}`,
      });
    }
    const ReviewButton = new ButtonBuilder()
      .setCustomId("crab-button_review-report")
      .setLabel("Mark as Reviewed")
      .setStyle(ButtonStyle.Success)
      .setEmoji(check);

    const row = new ActionRowBuilder().addComponents(ReviewButton);
    const channel = await interaction.guild.channels.fetch(
      GuildConfig.report_Logs
    );
    if (channel) {
      const ReportMessage = await channel.send({
        content: `<@&${SupervisorRole}>, a new report has been submitted by ${interaction.user}. Please review it and click the button.`,
        embeds: [embed],
        components: [row],
        files: [file],
      });
      interaction.reply({
        content:
          "Your report has been submitted and you will be messaged when it is reviewed.",
        flags: MessageFlags.Ephemeral,
      });
      const newReport = new GuildReport({
        IssuedBy: interaction.user.id,
        ReviewedBy: null,
        custom_field1: field1,
        ReportType: "custom",
        id: ReportID,
        guildId: interaction.guild.id,
        messageId: ReportMessage.id,
        custom_field2: field2,
        custom_field3: field3,
        custom_reportId: customReportId,
      });
      await newReport.save();
    } else {
      interaction.reply({
        content:
          "An error has occured, no report logging channel could be found. Please report this to your server administrator.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
