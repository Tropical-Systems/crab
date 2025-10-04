const {
  EmbedBuilder,
  inlineCode,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const crabCustomReports = require("../../schemas/CrabCustomReports");

module.exports = {
  customId: "crab_button-custom_report-field-one-edit",
  execute: async (interaction, client) => {
    const CustomReport =  await crabCustomReports.findOne({ guildId: interaction.guild.id })
  },
};
