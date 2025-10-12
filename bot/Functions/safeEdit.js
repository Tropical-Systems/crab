async function safeEdit(interaction, message, payload) {
  try {
    // --- 1️⃣ Prefer editing the original message if available ---
    if (message) {
      try {
        await message.edit(payload);
        return;
      } catch (err) {
        // Message might be deleted or unknown
        if (err.code !== 10008) throw err;
        console.warn("[safeEdit] Message no longer exists, falling back.");
      }
    }

    // --- 2️⃣ If no message, fall back to interaction responses ---
    if (interaction.deferred || interaction.replied) {
      // If interaction was already acknowledged (via defer or reply)
      await interaction.editReply(payload);
    } else if (interaction.isMessageComponent()) {
      // For buttons, menus, etc.
      await interaction.update(payload);
    } else {
      // Fallback for slash commands or unexpected cases
      await interaction.reply({ ...payload, ephemeral: true });
    }

  } catch (err) {
    // --- 3️⃣ Catch-all error handling ---
    console.error("[safeEdit Error]", err);

    // Make sure the interaction is acknowledged, so it doesn’t fail
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "⚠️ Something went wrong while editing the message.",
        ephemeral: true,
      }).catch(() => {});
    }
  }
}

module.exports = { safeEdit };
