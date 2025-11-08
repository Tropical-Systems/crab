const { MessageFlags } = require("discord.js");

async function safeEdit(interaction, message, payload) {
  try {
    if (message) {
      try {
        await message.edit(payload);
        return;
      } catch (err) {
        if (err.code !== 10008) throw err;
        console.warn("[safeEdit] Message no longer exists, falling back.");
      }
    }

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(payload);
    } else if (interaction.isMessageComponent()) {
      await interaction.update(payload);
    } else {
      await interaction.reply({ ...payload, flags: MessageFlags.Ephemeral });
    }
  } catch (err) {
    console.error("[safeEdit Error]", err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction
        .reply({
          content: "⚠️ Something went wrong while editing the message.",
          flags: MessageFlags.Ephemeral,
        })
        .catch(() => {});
    }
  }
}

module.exports = { safeEdit };
