const { EmbedBuilder, ChannelSelectMenuBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Guild, MessageFlags } = require('discord.js')
const { back_arrow, x, settings, minus_sign, clipboard_list, circle_1, circle_2, circle_3, circle_4, circle_5 } = require("../../../emojis.json")
const CrabCustomReports = require("../../schemas/CrabCustomReports")
module.exports = {
  customId: 'crab-sm_reports-custom',
  execute: async (interaction) => {
    const value = interaction.values[0]
    const GuildCustomReports = await CrabCustomReports.find({ guildId: interaction.guild.id })
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    const configRow = new ActionRowBuilder()
    const backButton = new ButtonBuilder()
      .setCustomId('crab-button_back')
      .setEmoji(back_arrow)
      .setLabel('Back')
      .setStyle(ButtonStyle.Success);
    const row3 = new ActionRowBuilder().addComponents(backButton)
    if (value === "report-config_add-custom") {
      ConfigEmbed.setDescription(`You are now configuring the **custom reports** section of the **reports** module. Below, you can find a guide to all fields and how to set it up!`)
      if (GuildCustomReports.length >= 3) {
        return interaction.reply({ content: `${x}, you have reached the limit of custom reports. You cannot make any more, if you wish you can remove a current report.`, flags: MessageFlags.Ephemeral })
      }
      const ConfigurationMenu = new StringSelectMenuBuilder()
      .setCustomId("report-config_add-custom-config")
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder("Select an option to configure on your form.")
      
      const ModalConfiguration = new StringSelectMenuOptionBuilder()
      .setValue("custom-report-add_modal-config")
      .setEmoji(settings)
      .setLabel("Configure Form Information")
      .setDescription("Configure the form data.")

      ConfigurationMenu.addOptions(ModalConfiguration)
      configRow.addComponents(ConfigurationMenu)
      return interaction.update({ embeds: [ConfigEmbed], components: [configRow, row3] })
    } else if (value.startsWith("report-config_edit")) {
      const [_, reportId] = value.split(":")
      const CustomReport = await CrabCustomReports.findOne({ crab_ReportId: reportId })
      const embed = new EmbedBuilder()
          .setTitle(`Report Customization Panel`)
          .setColor(0xec3935)
          .setDescription(`${clipboard_list} **${CustomReport.crab_ReportName} Report Information**\n> **Field One Name:** ${CustomReport.crab_ReportField1Label}\n> **Field One Placeholder:** ${CustomReport.crab_ReportField1PlaceHolder}\n\n> **Field Two Name:** ${CustomReport.crab_ReportField2Label || "Not Set"}\n> **Field Two Placeholder:** ${CustomReport.crab_ReportField2PlaceHolder || "Not Set"}\n\n> **Field Three Name:** ${CustomReport.crab_ReportField3Label || "Not Set"}\n> **Field Three Placeholder:** ${CustomReport.crab_ReportField3PlaceHolder || "Not Set"}`)
          
          const FieldOneEdit = new ButtonBuilder()
          .setCustomId(`crab_button-custom_report-field-edit:${reportId}:1`)
          .setEmoji(circle_1)
          .setLabel("Field One")
          .setStyle(ButtonStyle.Secondary)
          const FieldTwoEdit = new ButtonBuilder()
          .setCustomId(`crab_button-custom_report-field-edit:${reportId}:2`)
          .setEmoji(circle_2)
          .setLabel("Field Two")
          .setStyle(ButtonStyle.Secondary)
          const FieldThreeEdit = new ButtonBuilder()
          .setCustomId(`crab_button-custom_report-field-edit:${reportId}:3`)
          .setEmoji(circle_3)
          .setLabel("Field Three")
          .setStyle(ButtonStyle.Secondary)
          const RemoveCustomReport = new ButtonBuilder()
          .setCustomId(`crab_button-custom_report-remove:${reportId}:${interaction.message.id}`)
          .setEmoji(minus_sign)
          .setLabel("Remove Custom Report")
          .setStyle(ButtonStyle.Danger)
          const row = new ActionRowBuilder().addComponents(FieldOneEdit, FieldTwoEdit, FieldThreeEdit)
          const row2 = new ActionRowBuilder().addComponents(RemoveCustomReport)
          return await interaction.reply({ embeds: [embed], components: [row, row2], flags: MessageFlags.Ephemeral })
    }


  }
}
