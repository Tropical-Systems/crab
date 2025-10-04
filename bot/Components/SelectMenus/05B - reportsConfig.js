const { EmbedBuilder, ChannelSelectMenuBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Guild } = require('discord.js')
const { back_arrow, add_sign, minus_sign, circle_1, circle_2, circle_3 } = require("../../../emojis.json")
const CrabCustomReports = require("../../schemas/CrabCustomReports")
module.exports = {
  customId: 'crab-sm_reports',
  execute: async (interaction) => {
    const GuildCustomReports = await CrabCustomReports.find({ guildId: interaction.guild.id })
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    ConfigEmbed.setDescription(`You are now configuring the **reports** module of Crab! Below you will find the configuration you will set:\n* **Report Logging**\n  * Select the channel you wish to log your reports in.`)

    const ReportLogMenu = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText)
    .setCustomId('crab-sm_reports-log')
    .setPlaceholder('Report Logging')
    .setMaxValues(1);
    const CustomReportMenu = new StringSelectMenuBuilder()
    .setCustomId('crab-sm_reports-custom')
    .setPlaceholder('Custom Reports')
    .setMaxValues(1);
    const backButton = new ButtonBuilder()
    .setCustomId('crab-button_back')
    .setEmoji(back_arrow)
    .setLabel('Back')
    .setStyle(ButtonStyle.Success);

    const CustomReportAdd = new StringSelectMenuOptionBuilder()
    .setEmoji(add_sign)
    .setLabel(`Add Custom Report (${GuildCustomReports.length}/3)`)
    .setValue(`report-config_add-custom`)

    CustomReportMenu.addOptions(CustomReportAdd)
    for (let i = 0; i < GuildCustomReports.length; i++) {
      const CustomReport = GuildCustomReports[i]
      const emoji = eval(`circle_${i + 1}`);
      const CustomReportEdit = new StringSelectMenuOptionBuilder()
        .setEmoji(emoji)
        .setLabel(`${CustomReport.crab_ReportName}`)
        .setValue(`report-config_edit:${CustomReport.crab_ReportId}`)
      CustomReportMenu.addOptions(CustomReportEdit)
    }
    const row = new ActionRowBuilder().addComponents(ReportLogMenu)
    const row2 = new ActionRowBuilder().addComponents(CustomReportMenu)
    const row3 = new ActionRowBuilder().addComponents(backButton)
    interaction.update({ embeds: [ConfigEmbed], components: [row, row2, row3] })
  }
}
