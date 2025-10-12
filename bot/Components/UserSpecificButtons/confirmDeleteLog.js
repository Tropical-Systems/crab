const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const CrabRecords = require(`../../schemas/GuildRecord`);
const CrabReports = require(`../../schemas/GuildReport`);
const CrabPunishments = require(`../../schemas/CrabPunishment`);
const { punishmentMap } = require(`../../Commands/Slash/puishment`);
const { search, x, check } = require(`../../../emojis.json`);
const CrabCustomReport = require("../../schemas/CrabCustomReports");
const { safeEdit } = require("../../Functions/safeEdit")

module.exports = {
  customIdPrefix: "crab_button-confirm_delete",
  execute: async (interaction) => {
    const [_, messageId, authorizedUser, id] = interaction.customId.split(`:`);

    let message = null;
    try {
      if (messageId && interaction.channel) {
        message = await interaction.channel.messages.fetch(messageId);
      }
    } catch (error) {
      if (error.code !== 10008) console.error(`[Fetch Error]`, error);
    }

    if (authorizedUser !== interaction.user.id) {
      return safeEdit(interaction, message, {
        content: `${x} **Access denied**, only the executor of this command can interact with this button.`,
        components: [],
      });
    }

    const fullPunishmentId = punishmentMap.get(id);
    let Punishment;
    if (fullPunishmentId) {
      Punishment = await CrabPunishments.findOne({
        guildId: interaction.guild.id,
        punishment_id: fullPunishmentId,
      });
    }

    const Report = await CrabReports.findOne({
      guildId: interaction.guild.id,
      id: id,
    });
    const CustomReport = await CrabCustomReport.findOne({
      guildId: interaction.guild.id,
      crab_ReportId: id,
    });
    const Record = await CrabRecords.findOne({
      guildId: interaction.guild.id,
      id: id,
    });

    if (Report) {
      await Report.deleteOne({ guildId: interaction.guild.id, id: id });
      await safeEdit(interaction, message, {
        content: `${check} **Successfully** removed the report.`,
        components: [],
      });
    } else if (CustomReport) {
      await CustomReport.deleteOne({
        guildId: interaction.guild.id,
        crab_ReportId: id,
      });
      await safeEdit(interaction, message, {
        content: `${check} **Successfully** removed this custom report.`,
        components: [],
      });
    } else if (Record) {
      await Record.deleteOne({ guildId: interaction.guild.id, id: id });
      await safeEdit(interaction, message, {
        content: `${check} **Successfully** removed the record.`,
        components: [],
      });
    } else if (Punishment) {
      await Punishment.deleteOne({
        guildId: interaction.guild.id,
        id: fullPunishmentId,
      });
      await safeEdit(interaction, message, {
        content: `${check} **Successfully** removed the punishment.`,
        components: [],
      });
    } else {
      await safeEdit(interaction, message, {
        content: `${x} I could not locate a log from the provided id. Please double check the ID and try again.`,
        components: [],
      });
    }
  },
};
