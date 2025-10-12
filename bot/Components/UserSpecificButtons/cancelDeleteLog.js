const {
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const { search, x, check } = require("../../../emojis.json");
const { safeEdit } = require("../../Functions/safeEdit");

module.exports = {
  customIdPrefix: "crab_button-cancel_delete",
  execute: async (interaction) => {
    const [_, messageId, authorizedUser] = interaction.customId.split(":");
    let message = null;

    try {
      if (messageId && interaction.channel) {
        message = await interaction.channel.messages.fetch(messageId);
      }
    } catch (error) {
      if (error.code !== 10008) console.error("[Fetch Error]", error);
    }

    await safeEdit(interaction, message, {
      content: `${search} **Processing** your request...`,
      components: [],
    });

    if (authorizedUser !== interaction.user.id) {
      return safeEdit(interaction, message, {
        content: `${x} **Access denied**, only the executor of this command can interact with this button.`,
        components: [],
      });
    }

    return safeEdit(interaction, message, {
      content: `${check} Action canceled, I did not void any logs.`,
      components: [],
    });
  },
};
