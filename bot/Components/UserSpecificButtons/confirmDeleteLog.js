const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const CrabRecords = require(`../../schemas/GuildRecord`)
const CrabReports = require(`../../schemas/GuildReport`)
const CrabPunishments = require(`../../schemas/CrabPunishment`)
const { punishmentMap } = require(`../../Commands/Slash/puishment`)
const { search, x, check } = require(`../../../emojis.json`)
const CrabCustomReport = require('../../schemas/CrabCustomReports')
module.exports = {
  customIdPrefix: 'crab_button-confirm_delete',
  execute: async (interaction) => {
    const [ _, messageId, authorizedUser, id ] = interaction.customId.split(`:`)
    const message = await interaction.channel.messages.fetch(messageId)
    await message.edit({ content: `${search} **Processing** your request...`, components: [] })
    if (authorizedUser !== interaction.user.id) {
      return message.edit({ content: `${x} **Access denied**, only the executor of this command can interact with this button.` })
    }
    const fullPunishmentId = punishmentMap.get(id);
    let Punishment;
    if (fullPunishmentId) {
      Punishment = await CrabPunishments.findOne({ guildId: interaction.guild.id, punishment_id: fullPunishmentId });
    }
    const Report = await CrabReports.findOne({ guildId: interaction.guild.id, id: id })
    const CustomReport = await CrabCustomReport.findOne({ guildId: interaction.guild.id, crab_ReportId: id })
    const Record = await CrabRecords.findOne({ guildId: interaction.guild.id, id: id })
    if (Report) {
      await Report.deleteOne({ guildId: interaction.guild.id, id: id })
      message.edit(`${check} **Successfully** removed the report.`)
    } else if (CustomReport) {
      await CustomReport.deleteOne({ guildId: interaction.guild.id, crab_ReportId: id })
      message.edit(`${check} **Successfully** removed this custom report.`)
    } else if (Record) {
      await Record.deleteOne({ guildId: interaction.guild.id, id: id })
      message.edit(`${check} **Successfully** removed the record.`)
    } else if (Punishment) {
      await Punishment.deleteOne({ guildId: interaction.guild.id, id: fullPunishmentId })
      message.edit(`${check} **Successfully** removed the punishment.`)
    } else {
      message.edit(`${x} I could not locate a log from the provided id. Please double check the ID and try again.`)
    }

  }
}
