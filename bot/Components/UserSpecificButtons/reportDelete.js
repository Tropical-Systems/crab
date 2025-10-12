const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require("discord.js");
const { check, x, search } = require("../../../emojis.json")
module.exports = {
  customIdPrefix: "crab_button-custom_report-remove",
  execute: async (interaction, client) => {
    const [_, reportId, messageId] = interaction.customId.split(":");
    await interaction.update({
      content: `${search} **Fetching** the report...`,
      embeds: [],
      components: []
    });
    const response = await interaction.fetchReply();
    const confirmDelete = new ButtonBuilder()
      .setCustomId(
        `crab_button-confirm_delete:${response.id}:${interaction.user.id}:${reportId}`
      )
      .setEmoji(check)
      .setLabel("Confirm Delete")
      .setStyle(ButtonStyle.Danger);
    const cancelDelete = new ButtonBuilder()
      .setCustomId(
        `crab_button-cancel_delete:${response.id}:${interaction.user.id}`
      )
      .setEmoji(x)
      .setLabel("Cancel Delete")
      .setStyle(ButtonStyle.Secondary);
    const confirmationRow = new ActionRowBuilder().addComponents(
      confirmDelete,
      cancelDelete
    );
    await interaction.editReply({
      content: `${check} I was able to locate a report with this id string, would you like to proceed and void the report?\n-# This action is **irreversible**.`,
      components: [confirmationRow],
    });
  },
};
